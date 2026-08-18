import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "../services/transactions.service";
import { Transaction } from "../types/transaction.types";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);

      queryClient.setQueryData<Transaction[]>(["transactions"], (old = []) =>
        old.filter((t) => t.id !== id),
      );

      return { previousTransactions };
    },

    onError: (_err, id, context) => {
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
