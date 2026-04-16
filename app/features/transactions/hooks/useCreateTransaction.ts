import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../services/transactions.service";
import { Transaction } from "../types/transaction.types";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,

    // ✅ optimistic update
    onMutate: async (newTransaction: Transaction) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);

      // optimistic UI
      queryClient.setQueryData<Transaction[]>(["transactions"], (old = []) => [
        { ...newTransaction, id: Math.random().toString() },
        ...old,
      ]);

      return { previousTransactions };
    },

    // ❌ rollback on error
    onError: (_err, _newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions"],
          context.previousTransactions,
        );
      }
    },

    // 🔄 sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
