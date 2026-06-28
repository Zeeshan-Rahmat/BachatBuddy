import type { PartyStatus, SyncStatus, User, UserRole } from '../types/auth';

export type RemoteUserRow = {
  id: string;
  business_id: string | null;
  business_name: string | null;
  name: string;
  phone: string | null;
  business_phone: string | null;
  email: string;
  business_email: string | null;
  role: UserRole;
  username: string;
  password_hash: string | null;
  status: PartyStatus;
  biometric_enabled: boolean | null;
  address: string | null;
  business_address: string | null;
  business_logo?: string | null;
  img: string | null;
  sync_status: SyncStatus;
  updated_at: number | string;
  created_at: number | string;
};

export type RemoteUserInsert = {
  id: string;
  business_id: string | null;
  business_name: string | null;
  name: string;
  phone: string | null;
  business_phone: string | null;
  email: string;
  business_email: string | null;
  role: UserRole;
  username: string;
  password_hash: string | null;
  status: PartyStatus;
  biometric_enabled: boolean;
  address: string | null;
  business_address: string | null;
  business_logo: string | null;
  img: string | null;
  sync_status: SyncStatus;
  updated_at: number;
  created_at: number;
};

export type RemoteUserUpdate = Partial<Omit<RemoteUserInsert, 'id' | 'created_at'>>;

const toTimestamp = (value: number | string): number => {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Date.now() : parsed;
};

export const mapRemoteUserToLocal = (
  row: RemoteUserRow,
  localBiometricEnabled = false
): User => ({
  id: row.id,
  businessId: row.business_id,
  businessName: row.business_name,
  name: row.name,
  phone: row.phone,
  businessPhone: row.business_phone,
  email: row.email,
  businessEmail: row.business_email,
  role: row.role,
  username: row.username,
  passwordHash: row.password_hash,
  status: row.status,
  biometricEnabled: localBiometricEnabled,
  address: row.address,
  businessAddress: row.business_address,
  businessLogo: row.business_logo ?? null,
  img: row.img,
  syncStatus: 'synced',
  updatedAt: toTimestamp(row.updated_at),
  createdAt: toTimestamp(row.created_at),
});

export const mapLocalUserToRemoteInsert = (user: User): RemoteUserInsert => ({
  id: user.id,
  business_id: user.businessId,
  business_name: user.businessName,
  name: user.name,
  phone: user.phone,
  business_phone: user.businessPhone,
  email: user.email,
  business_email: user.businessEmail,
  role: user.role,
  username: user.username,
  password_hash: user.passwordHash,
  status: user.status,
  biometric_enabled: user.biometricEnabled,
  address: user.address,
  business_address: user.businessAddress,
  business_logo: user.businessLogo,
  img: user.img,
  sync_status: user.syncStatus,
  updated_at: user.updatedAt,
  created_at: user.createdAt,
});

export const mapLocalUserToRemoteUpdate = (user: User): RemoteUserUpdate => {
  const { id: _id, created_at: _createdAt, ...remoteUpdate } = mapLocalUserToRemoteInsert(user);
  return remoteUpdate;
};
