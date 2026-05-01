import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "../services/transactions.service";
import { Transaction } from "../types/transaction.types";

export type TransactionUpdatePayload = Omit<
  Transaction,
  "id" | "created_at" | "user_id"
>;

type EditTransactionInput = {
  id: string;
  updates: TransactionUpdatePayload;
};

export function useEditTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: EditTransactionInput) =>
      updateTransaction(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);

      queryClient.setQueryData<Transaction[]>(["transactions"], (old = []) =>
        old.map((transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                ...updates,
              }
            : transaction,
        ),
      );

      return { previousTransactions };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions"],
          context.previousTransactions,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
