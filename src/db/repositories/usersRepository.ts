// src/database/repositories/usersRepository.ts
// ─────────────────────────────────────────────────────────────────────────────
// backend_handover.md §2.B: "Facilitates clean profile lookup filters
// (ID, Email, or composite Username/Email match) and handles on-device
// biometric preference adjustments."
// ─────────────────────────────────────────────────────────────────────────────

import { User } from '@/src/types/auth';
import { eq, or } from 'drizzle-orm';
import { db } from '../client';
import { syncQueue, users, type NewSyncQueueRow, type UserRow } from '../schema';

function nowMs(): number {
    return Date.now();
}

function newUUID(): string {
    return crypto.randomUUID();
}

const buildQueueRow = (
    recordId: string,
    operation: NewSyncQueueRow['operation'],
    payload: NewSyncQueueRow['payload'],
    now: number
): NewSyncQueueRow => ({
    id: newUUID(),
    tableName: 'users',
    recordId,
    operation,
    payload,
    status: 'queued',
    attempts: 0,
    lastError: null,
    nextRetryAt: null,
    updatedAt: now,
    createdAt: now,
});

export const usersRepository = {
    // ── Lookups ──────────────────────────────────────────────────────────────
    async findById(id: string): Promise<UserRow | null> {
        const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return rows.length > 0 ? rows[0] : null;
    },

    async findByEmail(email: string): Promise<UserRow | null> {
        const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        return rows.length > 0 ? rows[0] : null;
    },

    // Composite match — username OR email (per auth.md flexible lookup)
    async findByUsernameOrEmail(value: string): Promise<UserRow | null> {
        const normalized = value.trim().toLowerCase();
        const rows = await db
            .select()
            .from(users)
            .where(or(eq(users.username, normalized), eq(users.email, normalized)))
            .limit(1);
        return rows.length > 0 ? rows[0] : null;
    },

    // ── Upsert (insert or update) ────────────────────────────────────────────
    // backend_handover.md §Step 3.1: "Atomic Local Upsert" after Supabase auth resolves
    async upsertUser(user: User): Promise<UserRow> {
        await db
            .insert(users)
            .values(user)
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    businessId: user.businessId,
                    businessName: user.businessName,
                    name: user.name,
                    phone: user.phone,
                    businessPhone: user.businessPhone,
                    email: user.email,
                    businessEmail: user.businessEmail,
                    role: user.role,
                    username: user.username,
                    passwordHash: user.passwordHash,
                    status: user.status,
                    biometricEnabled: user.biometricEnabled,
                    address: user.address,
                    businessAddress: user.businessAddress,
                    img: user.img,
                    syncStatus: user.syncStatus,
                    updatedAt: user.updatedAt,
                },
            });

        const savedUser = await this.findById(user.id);

        if (!savedUser) {
            throw new Error('Unable to load saved user profile.');
        }

        return savedUser;
    },

    // ── Biometric preference toggle ──────────────────────────────────────────
    async createLocalUser(user: User): Promise<UserRow> {
        const now = nowMs();
        const localUser: User = {
            ...user,
            syncStatus: 'pending_insert',
            updatedAt: user.updatedAt || now,
            createdAt: user.createdAt || now,
        };
        const queueRow = buildQueueRow(localUser.id, 'insert', localUser, now);

        db.transaction((tx) => {
            tx.insert(users).values(localUser).onConflictDoUpdate({
                target: users.id,
                set: {
                    businessId: localUser.businessId,
                    businessName: localUser.businessName,
                    name: localUser.name,
                    phone: localUser.phone,
                    businessPhone: localUser.businessPhone,
                    email: localUser.email,
                    businessEmail: localUser.businessEmail,
                    role: localUser.role,
                    username: localUser.username,
                    passwordHash: localUser.passwordHash,
                    status: localUser.status,
                    biometricEnabled: localUser.biometricEnabled,
                    address: localUser.address,
                    businessAddress: localUser.businessAddress,
                    img: localUser.img,
                    syncStatus: localUser.syncStatus,
                    updatedAt: localUser.updatedAt,
                },
            }).run();
            tx.insert(syncQueue).values(queueRow).run();
        });

        const savedUser = await this.findById(localUser.id);

        if (!savedUser) {
            throw new Error('Unable to create local user profile.');
        }

        return savedUser;
    },

    async replacePendingSignupUser(existingUserId: string, user: User): Promise<UserRow> {
        const existing = await this.findById(existingUserId);

        if (!existing || existing.syncStatus !== 'pending_insert') {
            throw new Error('Unable to repair existing signup profile.');
        }

        const now = nowMs();
        const localUser: User = {
            ...user,
            syncStatus: 'pending_insert',
            updatedAt: now,
            createdAt: existing.createdAt || user.createdAt || now,
        };
        const queueRow = buildQueueRow(localUser.id, 'insert', localUser, now);

        db.transaction((tx) => {
            tx.update(users).set(localUser).where(eq(users.id, existingUserId)).run();
            tx.insert(syncQueue).values(queueRow).run();
        });

        const savedUser = await this.findById(localUser.id);

        if (!savedUser) {
            throw new Error('Unable to repair existing signup profile.');
        }

        return savedUser;
    },

    async updateProfile(
        userId: string,
        updates: Partial<Pick<User, 'businessName' | 'businessPhone' | 'businessEmail' | 'businessAddress' | 'name' | 'phone' | 'address' | 'img'>>
    ): Promise<UserRow> {
        const existing = await this.findById(userId);

        if (!existing) {
            throw new Error('Profile not found.');
        }

        const now = nowMs();
        const updatedUser: UserRow = {
            ...existing,
            ...updates,
            syncStatus: existing.syncStatus === 'pending_insert' ? 'pending_insert' : 'pending_update',
            updatedAt: now,
        };
        const queueRow = buildQueueRow(userId, 'update', updatedUser, now);

        db.transaction((tx) => {
            tx.update(users).set(updatedUser).where(eq(users.id, userId)).run();
            tx.insert(syncQueue).values(queueRow).run();
        });

        return updatedUser;
    },

    async setBiometricEnabled(userId: string, biometricEnabled: boolean): Promise<UserRow> {
        const now = nowMs();

        await db
            .update(users)
            .set({
                biometricEnabled,
                updatedAt: now,
            })
            .where(eq(users.id, userId));

        const updatedUser = await this.findById(userId);

        if (!updatedUser) {
            throw new Error('Unable to update biometric preference.');
        }

        return updatedUser;
    },

    // ── Mark as synced after successful cloud push ───────────────────────────
    async markSynced(userId: string): Promise<void> {
        await db
            .update(users)
            .set({ syncStatus: 'synced' })
            .where(eq(users.id, userId));
    },
};
