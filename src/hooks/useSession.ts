// src/hooks/useSession.ts
// ─────────────────────────────────────────────────────────────────────────────
// Called once at the root layout level on app launch.
// backend_handover.md §Step 4: initializeLocalDatabase() → check auth_sessions
// → refresh if needed → setSession() → setLoading(false) to lift splash screen.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import { initializeLocalDatabase } from '../db/client';
import { restoreSession } from '../services/sessionService';
import { useAuthStore } from '../store/authStore';
import { useBiometricStore } from '../store/biometricStore';

export function useSession() {
  const { setSession, clearSession, setLoading } = useAuthStore();
  const { checkEnabled } = useBiometricStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      // Step 1 — ensure local DB structure is up to date
      await initializeLocalDatabase();

      // Step 2 — check biometric availability flag
      await checkEnabled();

      // Step 3 — attempt to restore a valid session from SQLite
      const result = await restoreSession();

      if (result.success && result.data) {
        setSession(result.data);
      } else {
        clearSession();
      }
    } catch (error) {
      console.error('[useSession] Bootstrap failed:', error);
      clearSession();
    } finally {
      // Step 4 — lift the splash screen regardless of outcome
      setLoading(false);
    }
  }
}
