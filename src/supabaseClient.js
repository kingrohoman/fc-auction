import { createClient } from '@supabase/supabase-js';

export const SUPABASE_STATE_ID = 'main';
export const SUPABASE_STATE_TABLE = 'fc_auction_state';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
