export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id?: string;
  user_id: string;
  amount: number;
  note: string;
  date: string;
  type: TransactionType;
  category_id: number;
  created_at: string;
};
