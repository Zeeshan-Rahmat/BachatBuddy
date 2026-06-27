// src/hooks/useAuth.ts
// ─────────────────────────────────────────────────────────────────────────────
// auth.md rule: "Screens should only use authStore or useAuth()."
// "Never read directly from Supabase inside screens."
//
// This hook is what you import into your EXISTING sign-in.tsx, sign-up.tsx,
// etc. to replace the TODO sections. No UI changes needed — only wire these
// handlers to your existing buttons/inputs.
// ─────────────────────────────────────────────────────────────────────────────

import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import * as authService from '../../services/auth/authService';
import * as sessionService from '../../services/sessionService';
import { useAuthStore } from '../../store/authStore';
import { useBiometricStore } from '../../store/biometricStore';
import type { UserRole } from '../../types/auth';

// ─────────────────────────────────────────────────────────────────────────────
// useSignIn — wire into sign-in.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function useSignIn() {
  const { setSession } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(
    async (username: string, role: UserRole, password: string) => {
      if (!username.trim() || !role || !password) {
        setError('All fields are required.');
        return;
      }
      setLoading(true);
      setError(null);

      const result = await authService.signIn({ username, role, password });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Persist to SQLite (source of truth), then update Zustand
      await sessionService.saveSession(result.data);
      setSession(result.data);

      const dest = result.data.user.role === 'owner' ? ROUTES.DASHBOARD : ROUTES.STOCK;
      router.replace(dest as any);
      setLoading(false);
    },
    [setSession]
  );

  return { signIn, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useSignUp — wire into sign-up.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(async (name: string, username: string, email: string, password: string, confirmPassword: string) => {
    if (!username.trim()) { setError('Username is required.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError(null);

    const result = await authService.signUp({ name, username, email, password });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push({ pathname: ROUTES.AUTH.SIGN_UP_OTP, params: { email } });
    setLoading(false);
  }, []);

  return { signUp, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useVerifyOtp — wire into sign-up-otp.tsx AND verify-otp.tsx (shared)
// ─────────────────────────────────────────────────────────────────────────────
export function useVerifyOtp(type: 'signup' | 'recovery') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (email: string, otp: string) => {
      if (!otp || otp.length < 6) {
        setError('Please enter the 6-digit OTP.');
        return;
      }
      setLoading(true);
      setError(null);

      const result = await authService.verifyOtp({ email, token: otp, type });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (type === 'signup') {
        router.push({ pathname: ROUTES.AUTH.SIGN_UP_VERIFIED, params: { email } });
      } else {
        router.push({ pathname: ROUTES.AUTH.EMAIL_VERIFIED, params: { email, flow: 'reset' } });
      }
      setLoading(false);
    },
    [type]
  );

  return { verify, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useForgotPassword — wire into forgot-password.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError(null);

    const result = await authService.forgotPassword(email);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push({ pathname: ROUTES.AUTH.VERIFY_OTP, params: { email, flow: 'reset' } });
    setLoading(false);
  }, []);

  return { sendOtp, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useResetPassword — wire into new-password.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = useCallback(async (password: string, confirmPassword: string) => {
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError(null);

    const result = await authService.updatePassword(password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(ROUTES.AUTH.PASSWORD_UPDATED);
    setLoading(false);
  }, []);

  return { resetPassword, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useBiometricSignIn — wire into fingerprint.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function useBiometricSignIn() {
  const { setSession } = useAuthStore();
  const { authenticate } = useBiometricStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithBiometric = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await authenticate();

    if (!result.success || !result.credentials) {
      setError(result.error ?? 'Biometric sign in failed.');
      setLoading(false);
      // auth.md §10: "If credentials missing → Navigate Sign In"
      if (!result.credentials) {
        router.replace(ROUTES.AUTH.SIGN_IN);
      }
      return;
    }

    // Restore session using saved tokens — validates/refreshes with Supabase
    const restoreResult = await sessionService.restoreSession();

    if (!restoreResult.success || !restoreResult.data) {
      setError('Session expired. Please sign in with your password.');
      router.replace(ROUTES.AUTH.SIGN_IN);
      setLoading(false);
      return;
    }

    setSession(restoreResult.data);
    const dest = restoreResult.data.user.role === 'owner' ? ROUTES.DASHBOARD : ROUTES.STOCK;
    router.replace(dest as any);
    setLoading(false);
  }, [authenticate, setSession]);

  return { signInWithBiometric, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useManageBiometric — wire into manage-fingerprint.tsx
// auth.md §11: user re-enters credentials, on success store tokens + enable
// ─────────────────────────────────────────────────────────────────────────────
export function useManageBiometric() {
  const { enable } = useBiometricStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enableBiometric = useCallback(
    async (username: string, role: UserRole, password: string) => {
      if (!username || !role || !password) {
        setError('All fields are required.');
        return;
      }
      setLoading(true);
      setError(null);

      const result = await authService.signIn({ username, role, password });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Save session to SQLite as usual
      await sessionService.saveSession(result.data);

      // Store credentials for biometric re-auth (never the password itself)
      await enable({
        user_id: result.data.user.id,
        email: result.data.user.email,
        username: result.data.user.username,
        role: result.data.user.role,
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      });

      router.replace(ROUTES.AUTH.FINGERPRINT);
      setLoading(false);
    },
    [enable]
  );

  return { enableBiometric, loading, error, clearError: () => setError(null) };
}

// ─────────────────────────────────────────────────────────────────────────────
// useSignOut — wire into drawer menu / settings
// ─────────────────────────────────────────────────────────────────────────────
export function useSignOut() {
  const { user, clearSession } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const signOut = useCallback(async () => {
    setLoading(true);

    if (user) {
      await sessionService.clearSession(user.id);
    }
    await authService.signOut();
    clearSession();

    router.replace(ROUTES.AUTH.SIGN_IN);
    setLoading(false);
  }, [user, clearSession]);

  return { signOut, loading };
}
