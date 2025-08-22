import {createClient} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
    throw new Error('anon 키 없음');
}

if (!supabaseUrl) {
    throw new Error('url 없음');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);