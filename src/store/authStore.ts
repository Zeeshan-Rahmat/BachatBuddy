// ─────────────────────────────────────────────────────────────────────────────
// BachatBuddy — Auth Store (Zustand)
// Client-side auth state. RBAC helpers enforce AGENTS.md permissions matrix.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import type { AuthActions, AuthSession, AuthState } from '../types/auth';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
    // ─── Initial State ──────────────────────────────────────────────────────────
    session: null,
    user: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,           // true on app start until session is checked
    biometricEnabled: false,

    // ─── Actions ────────────────────────────────────────────────────────────────

    setSession: (session: AuthSession) => {
        set({
            session,
            user: session.user,
            role: session.user.role,
            isAuthenticated: true,
            isLoading: false,
            biometricEnabled: session.user.biometric_enabled,
        });
    },

    clearSession: () => {
        set({
            session: null,
            user: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            biometricEnabled: false,
        });
    },

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setBiometricEnabled: (enabled: boolean) => {
        set({ biometricEnabled: enabled });
    },

    // ─── RBAC Helpers ──────────────────────────────────────────────────────────
    // AGENTS.md Role Permissions Matrix — enforced here and in route guards

    isOwner: () => get().role === 'owner',

    // Dashboard: Owner only — AGENTS.md: "Employee → BLOCKED"
    canAccessDashboard: () => get().role === 'owner',

    // Reports: Owner only — AGENTS.md: "Employee → BLOCKED"
    canAccessReports: () => get().role === 'owner',

    // Backup & Restore: Owner only — AGENTS.md: "Employee → BLOCKED"
    canAccessBackup: () => get().role === 'owner',

    // Employee mutations require approval — AGENTS.md Offline Outbox Pattern
    requiresApproval: () => get().role === 'employee',
}));