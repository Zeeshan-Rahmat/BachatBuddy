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
export type PartyStatus = 'Active' | 'Inactive';

export interface User {
    id: string;
    businessId: string | null;
    businessName: string | null;
    name: string;
    phone: string | null;
    businessPhone: string | null;
    email: string;
    businessEmail: string | null;
    role: UserRole;
    username: string;
    passwordHash: string | null;
    status: PartyStatus;
    biometricEnabled: boolean;
    address: string | null;
    businessAddress: string | null;
    img: string | null;
    syncStatus: SyncStatus;
    updatedAt: number; // Stored as integer timestamp
    createdAt: number; // Stored as integer timestamp
}

// Optional: If you also need a type for inserting new records (where defaults are optional)
export interface NewUser extends Omit<User, 'status' | 'biometricEnabled' | 'syncStatus'> {
    status?: PartyStatus;
    biometricEnabled?: boolean;
    syncStatus?: SyncStatus;
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

export interface VerifyOtpInput {
    email: string;
    token: string;
    type: 'signup' | 'recovery';
}

export interface ResetPasswordInput {
    email: string;
    otp: string;
    new_password: string;
}

export interface UpdatePasswordInput {
    password: string;
}


export interface BiometricCredentials {
    user_id: string;
    email: string;
    username: string;
    role: UserRole;
    access_token: string;
    refresh_token: string;
}

// ─── Result Wrapper ───────────────────────────────────────────────────────────
// Every service function returns this shape — never throws raw errors to UI

export type AuthResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: AuthErrorCode };

export type AuthErrorCode =
    | 'invalid_credentials'
    | 'email_exists'
    | 'username_exists'
    | 'weak_password'
    | 'otp_expired'
    | 'otp_invalid'
    | 'network_unavailable'
    | 'user_not_found'
    | 'role_mismatch'
    | 'session_expired'
    | 'biometric_unavailable'
    | 'biometric_not_enrolled'
    | 'unknown_error';
