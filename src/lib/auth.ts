import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isSupabaseEnabled = supabaseUrl !== "" && supabaseAnonKey !== "";

const getSupabaseClient = () => {
  if (isSupabaseEnabled) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return null;
};

const MOCK_EMAIL = "admin@team.com";
const MOCK_PASSWORD = "admin1234"; // Default static password for local testing

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } else {
    // Local Demo Mode Auth
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem("nexus_admin_session", JSON.stringify({ email, authenticated: true, timestamp: Date.now() }));
      }
      return { success: true };
    } else {
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다. (데모 계정: admin@team.com / admin1234)" };
    }
  }
}

export async function logout(): Promise<void> {
  const supabase = getSupabaseClient();
  
  if (supabase) {
    await supabase.auth.signOut();
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nexus_admin_session");
    }
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false; // Can't check on server side without cookies, CMS redirects will be handled client-side
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    // If Supabase is enabled, we check the auth token in local storage or session
    const sessionStr = localStorage.getItem("sb-" + supabaseUrl.replace("https://", "").split(".")[0] + "-auth-token");
    return !!sessionStr;
  } else {
    const session = localStorage.getItem("nexus_admin_session");
    if (!session) return false;
    try {
      const parsed = JSON.parse(session);
      return !!parsed.authenticated;
    } catch {
      return false;
    }
  }
}

export function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;

  const supabase = getSupabaseClient();
  if (supabase) {
    const sessionStr = localStorage.getItem("sb-" + supabaseUrl.replace("https://", "").split(".")[0] + "-auth-token");
    if (sessionStr) {
      try {
        const parsed = JSON.parse(sessionStr);
        return parsed.user?.email || null;
      } catch {
        return null;
      }
    }
    return null;
  } else {
    const session = localStorage.getItem("nexus_admin_session");
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.email || null;
    } catch {
      return null;
    }
  }
}
