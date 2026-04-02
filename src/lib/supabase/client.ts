import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://udwpovojufbpzrexvkcc.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkd3Bvdm9qdWZicHpyZXh2a2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzA0NjEsImV4cCI6MjA5MDIwNjQ2MX0.15MJDcnmqC33Z3MfaL0oAQK17M1YloAwqJUHkiW3H1U";

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
