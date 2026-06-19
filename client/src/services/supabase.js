import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Public project URL + publishable (anon) key — safe to ship in the client.
// RLS protects the data; the secret key lives only on the server.
const SUPABASE_URL = 'https://vowtcybdihvqvlwlmdpa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MLflPb3hR1Wi-mcvn7YY0g_D2d893gz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const SUPABASE_PUBLIC_URL = SUPABASE_URL;
