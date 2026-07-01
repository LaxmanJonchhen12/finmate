import { createClient } from "@/utils/supabase/client";

export const getTransactions = async (filter: string) => {
  const supabase = createClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (filter) {
    query = query.eq("type", filter);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data;
};
