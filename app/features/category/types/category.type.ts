export type TransactionType = "INCOME" | "EXPENSE";

export type Cateogry = {
  id: string;
  user_id?: string;
  name: string;
  type: TransactionType;
  created_at: string;
  isDefault: boolean;
};
