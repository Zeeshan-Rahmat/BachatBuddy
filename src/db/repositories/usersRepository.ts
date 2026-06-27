// src/database/repositories/usersRepository.ts
// ─────────────────────────────────────────────────────────────────────────────
// backend_handover.md §2.B: "Facilitates clean profile lookup filters
// (ID, Email, or composite Username/Email match) and handles on-device
// biometric preference adjustments."
// ─────────────────────────────────────────────────────────────────────────────

import { User } from '@/src/types/auth';
import { eq, or } from 'drizzle-orm';
import { db } from '../client';
import { users, type UserRow } from '../schema';

function nowMs(): number {
    return Date.now();
}

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
    async setBiometricEnabled(userId: string, biometricEnabled: boolean): Promise<UserRow> {
        const now = nowMs();

        await db
            .update(users)
            .set({
                biometricEnabled,
                syncStatus: 'pending_update',
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