// src/lib/secureStorage.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Secure Storage rule:
//   Store: refreshToken, accessToken, userId, biometricEnabled
//   Never store: passwords
// ─────────────────────────────────────────────────────────────────────────────

import * as SecureStore from 'expo-secure-store';
import type { BiometricCredentials } from '../types/auth';

const KEYS = {
  BIOMETRIC_CREDENTIALS: 'bb_biometric_credentials',
  BIOMETRIC_ENABLED: 'bb_biometric_enabled',
} as const;

// ─── Biometric Credentials ───────────────────────────────────────────────────
// Stores email + tokens + role so fingerprint login can restore a session
// WITHOUT ever storing the user's password.

export async function saveBiometricCredentials(
  credentials: BiometricCredentials
): Promise<void> {
  await SecureStore.setItemAsync(
    KEYS.BIOMETRIC_CREDENTIALS,
    JSON.stringify(credentials)
  );
  await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, 'true');
}

export async function loadBiometricCredentials(): Promise<BiometricCredentials | null> {
  const raw = await SecureStore.getItemAsync(KEYS.BIOMETRIC_CREDENTIALS);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BiometricCredentials;
  } catch {
    return null;
  }
}

export async function isBiometricEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
  return value === 'true';
}

export async function clearBiometricCredentials(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.BIOMETRIC_CREDENTIALS);
  await SecureStore.deleteItemAsync(KEYS.BIOMETRIC_ENABLED);
}

// ─── Update only the tokens (after a refresh) without touching other fields ──
export async function updateBiometricTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const existing = await loadBiometricCredentials();
  if (!existing) return;

  await saveBiometricCredentials({
    ...existing,
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}
