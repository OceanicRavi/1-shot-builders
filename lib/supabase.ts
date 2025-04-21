import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a single Supabase client for the browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false,
  },
});

// Create a client with the service role key for server operations
export const supabaseAdmin = (token?: string) => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  
  return createClient<Database>(
    supabaseUrl, 
    token || serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};