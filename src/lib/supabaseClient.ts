
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = 'https://bwbhoiykyolpcbjaxqmk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn('Supabase credentials missing! Please check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey || '');
