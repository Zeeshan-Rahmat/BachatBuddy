// src/store/biometric.store.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md §Zustand Stores → biometricStore: enabled, enable(), disable(), authenticate()
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  saveBiometricCredentials,
  loadBiometricCredentials,
  clearBiometricCredentials,
  isBiometricEnabled,
} from '../lib/secureStorage';
import type { BiometricCredentials } from '../types/auth';

interface BiometricState {
  enabled: boolean;
  hasSavedCredentials: boolean;
  isChecking: boolean;
}

interface BiometricActions {
  checkEnabled: () => Promise<void>;
  enable: (credentials: BiometricCredentials) => Promise<void>;
  disable: () => Promise<void>;
  authenticate: () => Promise<{ success: boolean; credentials: BiometricCredentials | null; error: string | null }>;
}

export const useBiometricStore = create<BiometricState & BiometricActions>((set) => ({
  enabled: false,
  hasSavedCredentials: false,
  isChecking: true,

  checkEnabled: async () => {
    const [enabled, credentials] = await Promise.all([
      isBiometricEnabled(),
      loadBiometricCredentials(),
    ]);
    const hasSavedCredentials = credentials !== null;
    if (enabled && !hasSavedCredentials) {
      await clearBiometricCredentials();
    }
    set({
      enabled: enabled && hasSavedCredentials,
      hasSavedCredentials,
      isChecking: false,
    });
  },

  enable: async (credentials: BiometricCredentials) => {
    await saveBiometricCredentials(credentials);
    set({ enabled: true, hasSavedCredentials: true });
  },

  disable: async () => {
    await clearBiometricCredentials();
    set({ enabled: false, hasSavedCredentials: false });
  },

  authenticate: async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware) {
      return { success: false, credentials: null, error: 'This device does not support biometric authentication.' };
    }
    if (!isEnrolled) {
      return { success: false, credentials: null, error: 'No biometrics enrolled on this device. Please set up Face ID / Fingerprint in device settings.' };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Sign in to BachatBuddy',
      fallbackLabel: 'Use Password',
      cancelLabel: 'Cancel',
    });

    if (!result.success) {
      return { success: false, credentials: null, error: 'Authentication failed.' };
    }

    const credentials = await loadBiometricCredentials();
    if (!credentials) {
      return { success: false, credentials: null, error: 'No saved credentials found. Please sign in with your password.' };
    }

    return { success: true, credentials, error: null };
  },
}));
