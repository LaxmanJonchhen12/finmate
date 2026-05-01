import { createClient } from "@/utils/supabase/client";
import { Transaction } from "../types/transaction.types";
import { TransactionUpdatePayload } from "../hooks/useEditTransaction";

// transactions.service.ts
export async function createTransaction(payload: Transaction) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateTransaction(
  id: string,
  updates: TransactionUpdatePayload,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as Transaction;
}
