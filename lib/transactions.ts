
import { createClient } from "@/utils/supabase/client";
export async function getTransactions() {
       const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}