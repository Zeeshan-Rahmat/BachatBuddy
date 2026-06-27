// src/services/profile.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Services: Responsible for fetch profile, update profile, sync profile
// ─────────────────────────────────────────────────────────────────────────────

import { usersRepository } from '../db/repositories/usersRepository';
import { supabase } from '../lib/supabase';
import type { AuthResult, PartyStatus, User, UserRole } from '../types/auth';

// ─── Fetch profile from Supabase (cloud) ─────────────────────────────────────
export async function fetchRemoteUser(userId: string): Promise<AuthResult<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, businessId, businessName, name, phone, businessPhone, businessEmail, passwordHash, status, biometricEnabled, address, businessAddress, img, syncStatus, updatedAt, createdAt')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Profile not found.', code: 'user_not_found' };
    }

    const profile: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role as UserRole,
      businessId: data.businessId ?? null,
      businessName: data.businessName ?? null,
      name: data.name, // Fallback to username if name is missing
      phone: data.phone ?? null,
      businessPhone: data.businessPhone ?? null,
      businessEmail: data.businessEmail ?? null,
      passwordHash: data.passwordHash ?? null,
      status: (data.status as PartyStatus) ?? 'Active',
      biometricEnabled: false, // Biometric flag is local-only, never synced to cloud
      address: data.address ?? null,
      businessAddress: data.businessAddress ?? null,
      img: data.img ?? null,
      syncStatus: 'synced', // Assuming this runs after a successful cloud fetch
      updatedAt: data.updatedAt ?? Date.now(),
      createdAt: data.createdAt ?? Date.now(),
    };

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

  // Preserve the local biometric_enabled flag (it's device-specific, not cloud data)
  const existingLocal = await usersRepository.findById(userId);
  const merged: User = {
    ...remoteResult.data,
    biometricEnabled: existingLocal?.biometricEnabled ?? false,
  };

  await usersRepository.upsertUser(merged);
  return { success: true, data: merged };
}

// ─── Update profile (business name, avatar, etc.) ────────────────────────────
export async function updateUser(
  userId: string,
  updates: Partial<Pick<User, 'businessName' | 'img'>>
): Promise<AuthResult<true>> {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message, code: 'unknown_error' };
    }

    // Re-sync local copy after cloud update succeeds
    await syncProfileToLocal(userId);

    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update profile.',
      code: 'unknown_error',
    };
  }
}
