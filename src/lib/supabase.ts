import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// IMPORTANT: createBrowserClient (not plain createClient) — yeh session ko
// cookies mein store karta hai, localStorage mein nahi. Middleware (server-side)
// sirf cookies padh sakta hai, isliye dono client same cookie-based session
// share karte hain. Plain createClient use karne se middleware ko session
// kabhi nahi milega, aur dashboard/login ke beech infinite redirect loop banega.
export const supabase = createBrowserClient(url, key)