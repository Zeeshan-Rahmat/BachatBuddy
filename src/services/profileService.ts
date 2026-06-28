// src/services/profile.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Services: Responsible for fetch profile, update profile, sync profile
// ─────────────────────────────────────────────────────────────────────────────

import { usersRepository } from '../db/repositories/usersRepository';
import { supabase } from '../lib/supabase';
import type { AuthResult, User } from '../types/auth';
import {
  mapLocalUserToRemoteUpdate,
  mapRemoteUserToLocal,
  type RemoteUserRow,
} from './userProfileMapper';

// ─── Fetch profile from Supabase (cloud) ─────────────────────────────────────
export async function fetchRemoteUser(userId: string): Promise<AuthResult<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, business_id, business_name, name, phone, business_phone, email, business_email, role, username, password_hash, status, biometric_enabled, address, business_address, img, sync_status, updated_at, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Profile not found.', code: 'user_not_found' };
    }

    const existingLocal = await usersRepository.findById(userId);
    const profile = mapRemoteUserToLocal(data as RemoteUserRow, existingLocal?.biometricEnabled ?? false);

    return { success: true, data: profile };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch profile.',
      code: 'unknown_error',
    };
  }
}

// ─── Sync profile: pull from Supabase, then upsert into local SQLite ─────────
// AGENTS.md: SQLite is the source of truth — this keeps it fresh after login.
export async function syncProfileToLocal(userId: string): Promise<AuthResult<User>> {
  const remoteResult = await fetchRemoteUser(userId);
  if (!remoteResult.success) return remoteResult;

  await usersRepository.upsertUser(remoteResult.data);
  return { success: true, data: remoteResult.data };
}

// ─── Update profile (business name, avatar, etc.) ────────────────────────────
export async function updateUser(
  userId: string,
  updates: Partial<Pick<User, 'businessName' | 'img'>>
): Promise<AuthResult<true>> {
  try {
    const updatedUser = await usersRepository.updateProfile(userId, updates);

    void supabase
      .from('users')
      .update(mapLocalUserToRemoteUpdate(updatedUser))
      .eq('id', userId)
      .then(({ error }) => {
        if (error) {
          console.warn('[Profile] Queued profile update for later sync:', error.message);
        }
      });

    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update profile.',
      code: 'unknown_error',
    };
  }
}
