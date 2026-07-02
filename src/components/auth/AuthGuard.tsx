// src/components/AuthGuard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps the root Stack. Handles:
//   - Session bootstrap on launch (useSession)
//   - Redirect unauthenticated users to sign-in
//   - Redirect authenticated users away from auth screens
//   - RBAC: block employees from dashboard/reports routes (AGENTS.md §5)
//
// This does NOT change any screen UI — it only controls navigation.
// ─────────────────────────────────────────────────────────────────────────────

import { useSession } from '@/src/hooks/useSession';
import { useAuthStore } from '@/src/store/authStore';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

const EMPLOYEE_BLOCKED_SEGMENTS = ['dashboard', 'reports'];
const EMPLOYEE_BLOCKED_PARTIES_SEGMENTS = ['employee', 'add-employee'];
const EMPLOYEE_BLOCKED_MODAL_SEGMENTS = ['export', 'customize_invoice', 'notification', 'change_password'];
const APP_SEGMENTS = ['dashboard', 'stock', 'sale', 'reports', 'parties'];
const AUTH_SUCCESS_SEGMENTS = ['sign-up-verified', 'email-verified', 'password-updated'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  useSession(); // bootstraps DB + restores session on mount

  const { isAuthenticated, isLoading, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)' || APP_SEGMENTS.includes(segments[0] ?? '');
    const inModalGroup = segments[0] === '(modal)';
    const currentSegment = segments[0] === '(app)' ? segments[1] : segments[0];
    const nestedSegment = segments[0] === '(app)' ? segments[2] : segments[1];

    if (!isAuthenticated && inAppGroup) {
      router.replace('/(auth)/sign-in');
      return;
    }

    if (isAuthenticated && inAuthGroup && !AUTH_SUCCESS_SEGMENTS.includes(segments[1] ?? '')) {
      const dest = user?.role === 'owner' ? '/(app)/dashboard' : '/(app)/stock';
      router.replace(dest as any);
      return;
    }

    // AGENTS.md §5: Employee blocked from Dashboard & Reports — enforce at navigation layer
    if (isAuthenticated && user?.role === 'employee' && inAppGroup) {
      if (currentSegment && EMPLOYEE_BLOCKED_SEGMENTS.includes(currentSegment)) {
        router.replace('/(app)/stock');
        return;
      }

      if (
        currentSegment === 'parties' &&
        nestedSegment &&
        EMPLOYEE_BLOCKED_PARTIES_SEGMENTS.includes(nestedSegment)
      ) {
        router.replace('/(app)/stock');
      }
    }

    if (
      isAuthenticated &&
      user?.role === 'employee' &&
      inModalGroup &&
      EMPLOYEE_BLOCKED_MODAL_SEGMENTS.includes(segments[1] ?? '')
    ) {
      router.replace('/(app)/stock');
    }
  }, [isAuthenticated, isLoading, user?.role, segments, router]);

  return <>{children}</>;
}
