import '@/src/lib/crypto';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env'
    );
}

// ─── SecureStore Adapter ──────────────────────────────────────────────────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
    },
});

// ─── Added Session Helper Function ────────────────────────────────────────────
export const getCurrentSupabaseSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('[Supabase] Error fetching session:', error);
        return { data: { session: null }, error };
    }
};
