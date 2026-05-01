import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
