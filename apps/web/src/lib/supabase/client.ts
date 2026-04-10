import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    // 返回 mock 客户端用于构建
    const mockClient = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error("Not configured") }),
        signUp: () => Promise.resolve({ data: null, error: new Error("Not configured") }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
    } as unknown as SupabaseClient;
    return mockClient;
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}

export const supabase = {
  from: (table: string) => getSupabaseClient().from(table),
  auth: {
    signInWithPassword: (options: { email: string; password: string }) =>
      getSupabaseClient().auth.signInWithPassword(options),
    signUp: (options: { email: string; password: string; phone?: string }) =>
      getSupabaseClient().auth.signUp(options),
    signOut: () => getSupabaseClient().auth.signOut(),
    getUser: () => getSupabaseClient().auth.getUser(),
  },
};
