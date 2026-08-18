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

export const getTransactionSummary = async (startDate: Date | string, endDate: Date | string, type: "INCOME" | "EXPENSE") => {
  const supabase = createClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
 if (startDate) {
  query = query.gte("date", new Date(startDate).toISOString())
}
  

  if (endDate) {
   query = query.lte("date", new Date(endDate).toISOString())
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;


  if (error) throw new Error(error.message);


  const total = data?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
return total;
};
