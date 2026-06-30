// src/database/repositories/sessionRepository.ts
// ─────────────────────────────────────────────────────────────────────────────
// backend_handover.md §Step 3.2: "Save the active access token, refresh token,
// and computed absolute expiry times inside the local auth_sessions table."
// ─────────────────────────────────────────────────────────────────────────────

import { AuthSession } from '@/src/types/auth';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '../client';
import { authSessions, type NewAuthSessionRow } from '../schema';

function nowMs(): number {
  return Date.now();
}

function newUUID(): string {
  return crypto.randomUUID();
}

export const sessionRepository = {
  // ── Save a new active session (deactivates any previous ones) ──────────
  async saveSession(session: AuthSession): Promise<void> {
    const now = nowMs();

    // Deactivate any existing active sessions for this user
    await db
      .update(authSessions)
      .set({ isActive: false, updatedAt: now })
      .where(eq(authSessions.userId, session.user.id));

    const newRow: NewAuthSessionRow = {
      id: newUUID(),
      userId: session.user.id,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
      isActive: true,
      updatedAt: now,
      createdAt: now,
    };

    await db.insert(authSessions).values(newRow);
  },

  // ── Find the active, non-expired session ─────────────────────────────────
  // backend_handover.md §Step 4.2: "Check local auth_sessions for isActive = 1
  // and expiresAt > Date.now()"
  async findActiveSession(): Promise<{
    user_id: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null> {
    const rows = await db
      .select()
      .from(authSessions)
      .where(
        and(
          eq(authSessions.isActive, true),
          gt(authSessions.expiresAt, nowMs())
        )
      )
      .limit(1);

    if (rows.length === 0) return null;

    return {
      user_id: rows[0].userId,
      access_token: rows[0].accessToken,
      refresh_token: rows[0].refreshToken,
      expires_at: rows[0].expiresAt,
    };
  },

  async findActiveSessionByUserId(userId: string): Promise<{
    user_id: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null> {
    const rows = await db
      .select()
      .from(authSessions)
      .where(
        and(
          eq(authSessions.userId, userId),
          eq(authSessions.isActive, true),
          gt(authSessions.expiresAt, nowMs())
        )
      )
      .limit(1);

    if (rows.length === 0) return null;

    return {
      user_id: rows[0].userId,
      access_token: rows[0].accessToken,
      refresh_token: rows[0].refreshToken,
      expires_at: rows[0].expiresAt,
    };
  },

  // ── Update tokens after a Supabase background refresh ────────────────────
  async refreshTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: number
  ): Promise<void> {
    await db
      .update(authSessions)
      .set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        updatedAt: nowMs(),
      })
      .where(and(eq(authSessions.userId, userId), eq(authSessions.isActive, true)));
  },

  // ── Clear session on sign out ─────────────────────────────────────────────
  async clearActiveSessions(userId: string): Promise<void> {
    await db
      .update(authSessions)
      .set({ isActive: false, updatedAt: nowMs() })
      .where(eq(authSessions.userId, userId));
  },
};
