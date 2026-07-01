import { createClient } from "@/utils/supabase/client";
export async function getCategories(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
