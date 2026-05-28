
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwbhoiykyolpcbjaxqmk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__1qJC58dAWEsS5_0VT3MOA_Uldpjd21';

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('VITE_SUPABASE_ANON_KEY not set in environment, using default value');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
