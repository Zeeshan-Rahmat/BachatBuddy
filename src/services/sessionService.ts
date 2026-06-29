// src/services/session.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Services: Responsible for restore session, refresh token,
// save session, clear session.
//
// Session Lifecycle (auth.md):
//   App Starts → Restore from SQLite → If expired → Refresh via Supabase
//   → Update SQLite → Update Zustand → Dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { sessionRepository } from '../db/repositories/sessionRepository';
import { usersRepository } from '../db/repositories/usersRepository';
import { updateBiometricTokens } from '../lib/secureStorage';
import { getCurrentSupabaseSession, supabase } from '../lib/supabase';
import type { AuthResult, AuthSession, BiometricCredentials } from '../types/auth';
import { syncProfileToLocal } from './profileService';

// ─────────────────────────────────────────────────────────────────────────────
// SAVE SESSION
// Persists to local SQLite (source of truth) — called right after sign in.
// ─────────────────────────────────────────────────────────────────────────────
export async function saveSession(session: AuthSession): Promise<void> {
  await usersRepository.upsertUser(session.user);
  await sessionRepository.saveSession(session);
}

// ─────────────────────────────────────────────────────────────────────────────
// RESTORE SESSION
// backend_handover.md §Step 4: called once at app startup.
//   1. Check local auth_sessions for active, unexpired record
//   2. If found, refresh via Supabase background mechanism
//   3. Return full Session object ready for Zustand
// ─────────────────────────────────────────────────────────────────────────────
export async function restoreSession(): Promise<AuthResult<AuthSession | null>> {
  try {
    const localSession = await sessionRepository.findActiveSession();

    if (!localSession) {
      // No local session at all — fresh sign-in required
      return { success: true, data: null };
    }

    // AGENTS.md local-first rule: SQLite is the source of truth.
    // We have a valid unexpired local session — load the user profile locally
    // first so the app can proceed even if we're completely offline.
    const localProfile = await usersRepository.findById(localSession.user_id);

    if (!localProfile) {
      // Session exists but profile is missing — corrupted state, clear it
      await sessionRepository.clearActiveSessions(localSession.user_id);
      return { success: true, data: null };
    }

    const offlineSession: AuthSession = {
      access_token: localSession.access_token,
      refresh_token: localSession.refresh_token,
      expires_at: localSession.expires_at,
      user: localProfile,
    };

    // Try to validate/refresh with Supabase in the background.
    // If this fails (offline), we still return the valid local session above —
    // the app must not block waiting for the network (AGENTS.md rule).
    try {
      const { data, error } = await getCurrentSupabaseSession();

      if (!error && data.session) {
        // Supabase confirms session is valid — refresh local copy with latest tokens
        const refreshedExpiresAt = data.session.expires_at
          ? data.session.expires_at * 1000
          : localSession.expires_at;

        await sessionRepository.refreshTokens(
          localSession.user_id,
          data.session.access_token,
          data.session.refresh_token,
          refreshedExpiresAt
        );
        await updateBiometricTokens(
          data.session.access_token,
          data.session.refresh_token,
          refreshedExpiresAt
        );

        // Pull latest profile data from cloud, merge into local SQLite
        const syncResult = await syncProfileToLocal(localSession.user_id);
        const freshProfile = syncResult.success ? syncResult.data : localProfile;

        return {
          success: true,
          data: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: refreshedExpiresAt,
            user: freshProfile,
          },
        };
      }
    } catch {
      // Network unavailable — fall through to offline session below
    }

    // Offline fallback — return the still-valid cached session
    return { success: true, data: offlineSession };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to restore session.',
      code: 'unknown_error',
    };
  }
}

export async function restoreSessionFromBiometricCredentials(
  credentials: BiometricCredentials
): Promise<AuthResult<AuthSession>> {
  try {
    if (!credentials.expires_at || credentials.expires_at <= Date.now()) {
      return { success: false, error: 'Session expired. Please sign in with your password.', code: 'session_expired' };
    }

    const localProfile = await usersRepository.findById(credentials.user_id);

    if (!localProfile) {
      return { success: false, error: 'Profile not found. Please sign in with your password.', code: 'user_not_found' };
    }

    const session: AuthSession = {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expires_at: credentials.expires_at,
      user: localProfile,
    };

    await saveSession(session);

    void refreshBiometricSessionInBackground(credentials).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('[Session] Background biometric refresh failed:', message);
    });

    return { success: true, data: session };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Biometric session restore failed.',
      code: 'unknown_error',
    };
  }
}

async function refreshBiometricSessionInBackground(credentials: BiometricCredentials): Promise<void> {
  const { data, error } = await supabase.auth.setSession({
    access_token: credentials.access_token,
    refresh_token: credentials.refresh_token,
  });

  if (error || !data.session) {
    return;
  }

  const expiresAt = data.session.expires_at
    ? data.session.expires_at * 1000
    : credentials.expires_at || Date.now() + 3600_000;

  await sessionRepository.refreshTokens(
    credentials.user_id,
    data.session.access_token,
    data.session.refresh_token,
    expiresAt
  );
  await updateBiometricTokens(
    data.session.access_token,
    data.session.refresh_token,
    expiresAt
  );

  await syncProfileToLocal(credentials.user_id);
}

// ─────────────────────────────────────────────────────────────────────────────
// REFRESH SESSION
// Explicit manual refresh (e.g. called before a sensitive operation)
// ─────────────────────────────────────────────────────────────────────────────
export async function refreshSession(userId: string): Promise<AuthResult<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session || !data.user) {
      return { success: false, error: 'Session expired. Please sign in again.', code: 'session_expired' };
    }

    const profile = await usersRepository.findById(userId);
    if (!profile) {
      return { success: false, error: 'Profile not found.', code: 'user_not_found' };
    }

    const expiresAt = data.session.expires_at
      ? data.session.expires_at * 1000
      : Date.now() + 3600_000;

    await sessionRepository.refreshTokens(
      userId,
      data.session.access_token,
      data.session.refresh_token,
      expiresAt
    );
    await updateBiometricTokens(data.session.access_token, data.session.refresh_token, expiresAt);

    return {
      success: true,
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: expiresAt,
        user: profile,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to refresh session.',
      code: 'unknown_error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR SESSION
// ─────────────────────────────────────────────────────────────────────────────
export async function clearSession(userId: string): Promise<void> {
  await sessionRepository.clearActiveSessions(userId);
}

export async function setLocalBiometricEnabled(userId: string, enabled: boolean): Promise<void> {
  await usersRepository.setBiometricEnabled(userId, enabled);
}
