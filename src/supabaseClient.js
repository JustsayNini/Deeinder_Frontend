// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// export const supabase = createClient(
//   supabaseUrl,
//   supabaseAnonKey
// );

import { createClient } from '@supabase/supabase-js';

// Pull the exact prefix keys from your active .env configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Safely instantiate and export the Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
