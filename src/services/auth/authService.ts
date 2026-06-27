// src/services/auth.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Services: "Only this file talks to Supabase Auth."
// Responsible for: login, signup, logout, forgot password, verify otp, reset password
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '../../lib/supabase';
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface MappedError {
  error: string;
  code: AuthErrorCode;
}

function mapSupabaseError(message: string): MappedError {
  const lower = message.toLowerCase();

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

function buildUserProfile(
  supaUserId: string,
  username: string,
  email: string,
  role: UserRole,
  businessId: string | null = null
): User {
  const now = Date.now();

  return {
    id: supaUserId,
    businessId: businessId,
    businessName: null,
    name: username,                // Mapping username to name as a fallback
    phone: null,
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
    img: null,                     // Fixed property name from avatar_url
    syncStatus: 'synced',          // Assuming 'synced' is a valid SyncStatus enum value
    updatedAt: now,
    createdAt: now,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SIGN UP — auth.md §2
// ─────────────────────────────────────────────────────────────────────────────
export async function signUp(
  input: SignUpInput
): Promise<AuthResult<{ userId: string }>> {
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

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
    });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
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

    const now = new Date().toISOString();

    // Create profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,

        // Business
        business_id: '',
        business_name: '',

        // User
        name: input.name.trim(),
        username: input.username.trim(),
        email: input.email.trim(),
        role: 'owner',

        // Optional
        phone: input.phone?.trim() ?? '',
        business_phone: '',
        business_email: '',
        password_hash: '',
        address: '',
        business_address: '',
        img: '',

        // Defaults
        status: 'Active',
        biometric_enabled: false,
        sync_status: 'pending_insert',

        created_at: now,
        updated_at: now,
      });

    if (profileError) {
      // PostgreSQL unique violation
      if (profileError.code === '23505') {
        return {
          success: false,
          error: 'Username is already taken.',
          code: 'username_exists',
        };
      }

      return {
        success: false,
        error: profileError.message,
        code: 'unknown_error',
      };
    }

    return {
      success: true,
      data: {
        userId: data.user.id,
      },
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : 'Sign up failed.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VERIFY OTP — auth.md §3 and §6 (shared between signup + recovery)
// ─────────────────────────────────────────────────────────────────────────────
export async function verifyOtp(input: VerifyOtpInput): Promise<AuthResult<true>> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email: input.email,
      token: input.token,
      type: input.type,
    });

    if (error) {
      const { error: msg, code } = mapSupabaseError(error.message);
      return { success: false, error: msg, code };
    }

    return { success: true, data: true };
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
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_email_by_username', {
      p_username: input.username,
    });

    if (rpcError || !rpcData) {
      return { success: false, error: 'User not found.', code: 'user_not_found' };
    }

    const email = rpcData as string;

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
      .select('username, role, business_id')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileRow) {
      return { success: false, error: 'Profile not found.', code: 'user_not_found' };
    }

    if (profileRow.role !== input.role) {
      return {
        success: false,
        error: `This account is registered as "${profileRow.role}", not "${input.role}".`,
        code: 'role_mismatch',
      };
    }

    const profile = buildUserProfile(
      data.user.id,
      profileRow.username,
      email,
      profileRow.role as UserRole,
      profileRow.business_id
    );

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
