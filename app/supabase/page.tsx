"use client";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/transactions";
import TransactionForm from "../features/transactions/components/TransactionForm";
import TransactionCard from "../features/transactions/components/TransectionCard";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p>Failed to load transactions</p>;
  if (!data?.length) return <p>No transactions yet</p>;

  return (
    <main>
      <h1>Transactions</h1>
      <TransactionForm />
      {data.map((transaction) => (
        <TransactionCard
          id={transaction.id}
          key={transaction.id}
          note={transaction.note}
          amount={transaction.amount}
          type={transaction.type}
        />
      ))}
    </main>
  );
}
