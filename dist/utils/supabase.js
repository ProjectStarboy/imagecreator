import { createClient } from "@supabase/supabase-js";
const supabase = createClient(GetConvar("supabase_url", ""), GetConvar("supabase_key", ""), {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
export default supabase;
//# sourceMappingURL=supabase.js.map