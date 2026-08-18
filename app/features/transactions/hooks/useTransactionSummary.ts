import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/lib/transactions";

export const useTransactionSummary = (startDate: Date | string, endDate: Date | string, type: "INCOME" | "EXPENSE") => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactionSummary", startDate, endDate, type],
    queryFn: () => getTransactionSummary(startDate, endDate, type),
  });
  return { data, isLoading, error };
};      
