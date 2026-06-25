import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured yet.');
}

export const supabase = createClient(
    supabaseUrl ?? '',
    supabaseAnonKey ?? '',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: false,
            detectSessionInUrl: false,
        },
    },
);
