// ─────────────────────────────────────────────────────────────────────────────
// BachatBuddy — Auth Types
// Strict types compiled from Drizzle schema. Never use `any` for these.
// ─────────────────────────────────────────────────────────────────────────────

// RBAC roles — matches AGENTS.md Role Permissions Matrix
export type UserRole = 'owner' | 'employee';

// Sync status — matches AGENTS.md Local Data Modeling spec
export type SyncStatus =
    | 'synced'
    | 'pending_insert'
    | 'pending_update'
    | 'pending_delete'
    | 'pending_approval'
    | 'rejected';

// ─── Core User Entity ────────────────────────────────────────────────────────
// Mirrors the local SQLite `users` table via Drizzle schema
export interface User {
    id: string;             // UUID — generated on device via crypto.randomUUID()
    username: string;
    email: string;
    role: UserRole;
    business_name: string | null;
    avatar_url: string | null;
    biometric_enabled: boolean;
    sync_status: SyncStatus;
    updated_at: number;     // Unix ms timestamp
    created_at: number;
}

// ─── Auth Session ─────────────────────────────────────────────────────────────
export interface AuthSession {
    access_token: string;
    refresh_token: string;
    expires_at: number;     // Unix ms timestamp
    user: User;
}

export interface SignUpResult {
    email: string;
    requiresEmailConfirmation: boolean;
    session: AuthSession | null;
}

// ─── Auth Store State ────────────────────────────────────────────────────────
export interface AuthState {
    session: AuthSession | null;
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    biometricEnabled: boolean;
}

// ─── Auth Store Actions ───────────────────────────────────────────────────────
export interface AuthActions {
    setSession: (session: AuthSession) => void;
    clearSession: () => void;
    setLoading: (loading: boolean) => void;
    setBiometricEnabled: (enabled: boolean) => void;
    // RBAC helpers
    isOwner: () => boolean;
    canAccessDashboard: () => boolean;
    canAccessReports: () => boolean;
    canAccessBackup: () => boolean;
    requiresApproval: () => boolean;
}

// ─── Service Input / Output Types ────────────────────────────────────────────

export interface SignInInput {
    username: string;
    role: UserRole;
    password: string;
}

export interface SignUpInput {
    username: string;
    email: string;
    password: string;
}

export interface OtpVerifyInput {
    email: string;
    otp: string;
}

export interface ResetPasswordInput {
    email: string;
    otp: string;
    new_password: string;
}

export interface BiometricBindInput {
    username: string;
    role: UserRole;
    password: string;
}

// ─── Service Result Wrapper ───────────────────────────────────────────────────
// Every service function returns this — no raw throws leaked to UI layer
export type AuthResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };
