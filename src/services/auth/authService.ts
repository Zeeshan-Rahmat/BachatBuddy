// src/services/auth.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Services: "Only this file talks to Supabase Auth."
// Responsible for: login, signup, logout, forgot password, verify otp, reset password
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '../../lib/supabase';
import { usersRepository } from '../../db/repositories/usersRepository';
import * as SecureStore from 'expo-secure-store';
import type {
  AuthErrorCode,
  AuthResult,
  AuthSession,
  SignInInput,
  SignUpInput,
  User,
  UserRole,
  VerifyOtpInput,
} from '../../types/auth';
import {
  mapLocalUserToRemoteInsert,
  mapRemoteUserToLocal,
  type RemoteUserRow,
} from '../userProfileMapper';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface MappedError {
  error: string;
  code: AuthErrorCode;
}

type PendingSignupDraft = {
  name: string;
  username: string;
  email: string;
  phone: string | null;
};

const pendingSignupKey = (email: string): string => {
  const safeEmail = email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_');

  return `bb_pending_signup_${safeEmail}`;
};

async function savePendingSignupDraft(input: SignUpInput): Promise<void> {
  const draft: PendingSignupDraft = {
    name: input.name.trim(),
    username: input.username.trim().toLowerCase(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
  };

  await SecureStore.setItemAsync(pendingSignupKey(draft.email), JSON.stringify(draft));
}

async function loadPendingSignupDraft(email: string): Promise<PendingSignupDraft | null> {
  const raw = await SecureStore.getItemAsync(pendingSignupKey(email));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingSignupDraft;
  } catch {
    return null;
  }
}

async function clearPendingSignupDraft(email: string): Promise<void> {
  await SecureStore.deleteItemAsync(pendingSignupKey(email));
}

function mapSupabaseError(message: string): MappedError {
  const lower = message.toLowerCase();

  if (
    lower.includes('unexpected_failure') ||
    lower.includes('"status":500') ||
    lower.includes('"status": 500') ||
    lower.includes('auth/v1/signup')
  ) {
    return {
      error: 'Supabase could not complete signup right now. Please check Auth logs and email provider settings, then try again.',
      code: 'unknown_error',
    };
  }
  if (lower.includes('invalid login credentials')) {
    return { error: 'Incorrect username or password.', code: 'invalid_credentials' };
  }
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return { error: 'An account with this email already exists.', code: 'email_exists' };
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return { error: 'Password is too weak. Use at least 6 characters.', code: 'weak_password' };
  }
  if (lower.includes('expired')) {
    return { error: 'OTP has expired. Please request a new one.', code: 'otp_expired' };
  }
  if (lower.includes('invalid') && lower.includes('otp')) {
    return { error: 'Invalid OTP. Please check and try again.', code: 'otp_invalid' };
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return { error: 'No internet connection. Please try again.', code: 'network_unavailable' };
  }

  return { error: message, code: 'unknown_error' };
}

function mapUnknownAuthError(err: unknown, fallback: string): MappedError {
  if (err instanceof Error) {
    return mapSupabaseError(err.message);
  }

  return {
    error: fallback,
    code: 'unknown_error',
  };
}

function mapLocalPersistenceError(error: unknown): MappedError {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes('unique constraint failed: users.username')) {
    return { error: 'This username is already used on this device. Please choose another username.', code: 'username_exists' };
  }

  if (lower.includes('unique constraint failed: users.email')) {
    return { error: 'This email is already saved on this device. Please sign in instead.', code: 'email_exists' };
  }

  return {
    error: error instanceof Error ? error.message : 'Unable to save local profile.',
    code: 'unknown_error',
  };
}

function buildUserProfile(
  supaUserId: string,
  username: string,
  email: string,
  role: UserRole,
  businessId: string | null = null,
  name = username,
  phone: string | null = null
): User {
  const now = Date.now();

  return {
    id: supaUserId,
    businessId: businessId,
    businessName: null,
    name,
    phone,
    businessPhone: null,
    email: email,
    businessEmail: null,
    role: role,
    username: username,
    passwordHash: null,            // Often managed by Supabase Auth instead of local state
    status: 'Active',              // Assuming 'active' is a valid PartyStatus enum value
    biometricEnabled: false,       // Fixed property name from biometric_enabled
    address: null,
    businessAddress: null,
    businessLogo: null,
    img: null,                     // Fixed property name from avatar_url
    syncStatus: 'synced',
    updatedAt: now,
    createdAt: now,
  };
}

async function upsertRemoteUserProfile(user: User): Promise<string | null> {
  const { error } = await supabase
    .from('users')
    .upsert(mapLocalUserToRemoteInsert(user), { onConflict: 'id' });

  return error?.message ?? null;
}

async function createLocalProfileForAuthUser(
  supaUserId: string,
  input: SignUpInput
): Promise<User> {
  const localProfile = buildUserProfile(
    supaUserId,
    input.username.trim().toLowerCase(),
    input.email.trim().toLowerCase(),
    'owner',
    null,
    input.name.trim(),
    input.phone?.trim() || null
  );

  const existingLocalProfile = await usersRepository.findByUsernameOrEmail(localProfile.username);

  if (
    existingLocalProfile &&
    existingLocalProfile.id !== supaUserId &&
    existingLocalProfile.syncStatus === 'pending_insert' &&
    existingLocalProfile.email.toLowerCase() === localProfile.email
  ) {
    return usersRepository.replacePendingSignupUser(existingLocalProfile.id, localProfile);
  }

  return usersRepository.createLocalUser(localProfile);
}

async function createLocalProfileFromDraft(
  supaUserId: string,
  draft: PendingSignupDraft
): Promise<User> {
  const localProfile = buildUserProfile(
    supaUserId,
    draft.username,
    draft.email,
    'owner',
    null,
    draft.name,
    draft.phone
  );

  const existingLocalProfile = await usersRepository.findByUsernameOrEmail(localProfile.username);

  if (
    existingLocalProfile &&
    existingLocalProfile.id !== supaUserId &&
    existingLocalProfile.syncStatus === 'pending_insert' &&
    existingLocalProfile.email.toLowerCase() === localProfile.email
  ) {
    return usersRepository.replacePendingSignupUser(existingLocalProfile.id, localProfile);
  }

  return usersRepository.createLocalUser(localProfile);
}

async function repairExistingSignUp(
  input: SignUpInput
): Promise<AuthResult<{ userId: string; recoveredExistingAccount?: boolean }> | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });

  if (error || !data.user) {
    return null;
  }

  const existingLocalProfile = await usersRepository.findById(data.user.id);
  const savedProfile = existingLocalProfile ?? await createLocalProfileForAuthUser(data.user.id, input);
  const remoteError = await upsertRemoteUserProfile(savedProfile);

  if (remoteError) {
    console.warn('[Auth] Existing account profile queued for later sync:', remoteError);
  }

  return {
    success: true,
    data: {
      userId: data.user.id,
      recoveredExistingAccount: true,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SIGN UP — auth.md §2
// ─────────────────────────────────────────────────────────────────────────────
export async function signUp(
  input: SignUpInput
): Promise<AuthResult<{ userId: string; recoveredExistingAccount?: boolean }>> {
  try {
    // Validate required fields
    if (
      !input.username.trim() ||
      !input.email.trim() ||
      !input.password.trim() ||
      !input.name.trim()
    ) {
      return {
        success: false,
        error: 'Please fill in all required fields.',
        code: 'validation_error',
      };
    }

    await savePendingSignupDraft(input);

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      if (code === 'email_exists') {
        const repairedSignUp = await repairExistingSignUp(input);

        if (repairedSignUp) {
          return repairedSignUp;
        }

        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: input.email.trim().toLowerCase(),
        });

        if (!resendError) {
          return {
            success: true,
            data: {
              userId: 'pending-email-confirmation',
            },
          };
        }

        const { error: resendMsg, code: resendCode } = mapSupabaseError(resendError.message);

        return {
          success: false,
          error: resendMsg,
          code: resendCode,
        };
      }

      return {
        success: false,
        error: msg,
        code,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Sign up failed.',
        code: 'unknown_error',
      };
    }

    if (!data.session) {
      return {
        success: true,
        data: {
          userId: data.user.id,
        },
      };
    }

    let savedProfile: User;

    try {
      savedProfile = await createLocalProfileForAuthUser(data.user.id, input);
    } catch (err) {
      const { error: msg, code } = mapLocalPersistenceError(err);
      return { success: false, error: msg, code };
    }

    const remoteError = await upsertRemoteUserProfile(savedProfile);

    if (remoteError) {
      console.warn('[Auth] Queued profile for later sync:', remoteError);
    }

    return {
      success: true,
      data: {
        userId: data.user.id,
      },
    };
  } catch (err) {
    const { error, code } = mapUnknownAuthError(err, 'Sign up failed.');

    return {
      success: false,
      error,
      code,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VERIFY OTP — auth.md §3 and §6 (shared between signup + recovery)
// ─────────────────────────────────────────────────────────────────────────────
export async function resendSignupOtp(email: string): Promise<AuthResult<true>> {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address.',
        code: 'validation_error',
      };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      return { success: false, error: msg, code };
    }

    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to resend OTP.',
      code: 'unknown_error',
    };
  }
}

export async function verifyOtp(input: VerifyOtpInput): Promise<AuthResult<AuthSession | null>> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: input.email,
      token: input.token,
      type: input.type,
    });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      return { success: false, error: msg, code };
    }

    if (input.type === 'signup' && data.user) {
      const draft = await loadPendingSignupDraft(input.email);

      if (draft) {
        const existingLocalProfile = await usersRepository.findById(data.user.id);
        let savedProfile: User;

        try {
          savedProfile = existingLocalProfile ?? await createLocalProfileFromDraft(data.user.id, draft);
        } catch (err) {
          const { error: msg, code } = mapLocalPersistenceError(err);
          return { success: false, error: msg, code };
        }

        const remoteError = await upsertRemoteUserProfile(savedProfile);

        if (remoteError) {
          console.warn('[Auth] Verified profile queued for later sync:', remoteError);
        }

        await clearPendingSignupDraft(input.email);
      }
    }

    if (!data.session || !data.user) {
      return { success: true, data: null };
    }

    const profile = await usersRepository.findById(data.user.id);

    if (!profile) {
      return {
        success: false,
        error: 'Profile not found after verification. Please sign in.',
        code: 'user_not_found',
      };
    }

    const authSession: AuthSession = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
        ? data.session.expires_at * 1000
        : Date.now() + 3600_000,
      user: profile,
    };

    return { success: true, data: authSession };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'OTP verification failed.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SIGN IN — auth.md §1
// Uses the get_email_by_username RPC to resolve username → email first.
// ─────────────────────────────────────────────────────────────────────────────
export async function signIn(input: SignInInput): Promise<AuthResult<AuthSession>> {
  try {
    // Step 1 — resolve email from username via Postgres RPC
    const normalizedLogin = input.username.trim().toLowerCase();
    const normalizedRole = input.role.toLowerCase() as UserRole;
    const localUser = await usersRepository.findByUsernameOrEmail(normalizedLogin);
    let email = localUser?.email ?? null;

    if (!email) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_email_by_username', {
        p_username: normalizedLogin,
      });

      if (rpcError || !rpcData) {
        return { success: false, error: 'User not found.', code: 'user_not_found' };
      }

      email = rpcData as string;
    }

    // Step 2 — authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      return { success: false, error: msg, code };
    }
    if (!data.session || !data.user) {
      return { success: false, error: 'Authentication failed.', code: 'unknown_error' };
    }

    // Step 3 — fetch profile row to confirm role matches what was selected
    const { data: profileRow, error: profileError } = await supabase
      .from('users')
      .select('id, business_id, business_name, name, phone, business_phone, email, business_email, role, username, password_hash, status, biometric_enabled, address, business_address, img, sync_status, updated_at, created_at')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileRow) {
      if (!localUser || localUser.id !== data.user.id) {
        return { success: false, error: 'Profile not found.', code: 'user_not_found' };
      }

      if (localUser.role !== normalizedRole) {
        return {
          success: false,
          error: `This account is registered as "${localUser.role}", not "${normalizedRole}".`,
          code: 'role_mismatch',
        };
      }

      const remoteError = await upsertRemoteUserProfile(localUser);

      if (remoteError) {
        console.warn('[Auth] Local profile still queued for sync:', remoteError);
      }

      const session: AuthSession = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
          ? data.session.expires_at * 1000
          : Date.now() + 3600_000,
        user: localUser,
      };

      return { success: true, data: session };
    }

    const remoteProfile = profileRow as RemoteUserRow;

    if (remoteProfile.role !== normalizedRole) {
      return {
        success: false,
        error: `This account is registered as "${remoteProfile.role}", not "${normalizedRole}".`,
        code: 'role_mismatch',
      };
    }

    const profile = mapRemoteUserToLocal(remoteProfile);
    await usersRepository.upsertUser(profile);

    const session: AuthSession = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
        ? data.session.expires_at * 1000
        : Date.now() + 3600_000,
      user: profile,
    };

    return { success: true, data: session };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Sign in failed.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FORGOT PASSWORD — auth.md §5
// ─────────────────────────────────────────────────────────────────────────────
export async function forgotPassword(email: string): Promise<AuthResult<true>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      return { success: false, error: msg, code };
    }

    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send reset email.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. UPDATE PASSWORD — auth.md §8 (after recovery OTP verified)
// ─────────────────────────────────────────────────────────────────────────────
export async function updatePassword(password: string): Promise<AuthResult<true>> {
  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      return { success: false, error: msg, code };
    }

    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update password.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SIGN OUT — auth.md §Services
// ─────────────────────────────────────────────────────────────────────────────
export async function signOut(): Promise<AuthResult<true>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message, code: 'unknown_error' };
    }
    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Sign out failed.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. GET CURRENT SUPABASE SESSION (used by session.service.ts for restore/refresh)
// ─────────────────────────────────────────────────────────────────────────────
export async function getCurrentSupabaseSession() {
  return supabase.auth.getSession();
}
