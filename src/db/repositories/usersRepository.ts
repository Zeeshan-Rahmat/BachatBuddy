import { eq, or } from 'drizzle-orm';
import { db } from '../client';
import { users, type NewUserRow, type UserRow } from '../schema';

export const findUserById = async (id: string): Promise<UserRow | undefined> => {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0];
};

export const findUserByEmail = async (email: string): Promise<UserRow | undefined> => {
    const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return rows[0];
};

export const findUserByUsernameOrEmail = async (value: string): Promise<UserRow | undefined> => {
    const normalized = value.trim().toLowerCase();
    const rows = await db
        .select()
        .from(users)
        .where(or(eq(users.username, normalized), eq(users.email, normalized)))
        .limit(1);

    return rows[0];
};

export const upsertUser = async (user: NewUserRow): Promise<UserRow> => {
    await db
        .insert(users)
        .values(user)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                businessId: user.businessId,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                username: user.username,
                passwordHash: user.passwordHash,
                status: user.status,
                biometricEnabled: user.biometricEnabled,
                address: user.address,
                img: user.img,
                syncStatus: user.syncStatus,
                updatedAt: user.updatedAt,
            },
        });

    const savedUser = await findUserById(user.id);

    if (!savedUser) {
        throw new Error('Unable to load saved user profile.');
    }

    return savedUser;
};

export const updateUserBiometricPreference = async (
    userId: string,
    biometricEnabled: boolean,
): Promise<UserRow> => {
    const now = Date.now();

    await db
        .update(users)
        .set({
            biometricEnabled,
            syncStatus: 'pending_update',
            updatedAt: now,
        })
        .where(eq(users.id, userId));

    const updatedUser = await findUserById(userId);

    if (!updatedUser) {
        throw new Error('Unable to update biometric preference.');
    }

    return updatedUser;
};
