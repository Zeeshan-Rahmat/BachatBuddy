import { useEffect, useRef } from 'react';
import { initializeLocalDatabase } from '../db/client';
import { useAuthStore } from '../store/authStore';
import { useBiometricStore } from '../store/biometricStore';

export function useSession() {
  const { clearSession, setLoading } = useAuthStore();
  const { checkEnabled } = useBiometricStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function bootstrap() {
      try {
        await initializeLocalDatabase();
        await checkEnabled();

        // Require password or biometric unlock on every fresh app launch.
        clearSession();
      } catch (error) {
        console.error('[useSession] Bootstrap failed:', error);
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [checkEnabled, clearSession, setLoading]);
}
