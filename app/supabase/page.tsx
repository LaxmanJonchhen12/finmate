"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/transactions";
import TransactionForm from "../features/transactions/components/TransactionForm";
import TransactionCard from "../features/transactions/components/TransectionCard";
import { useState } from "react";
import { Transaction } from "../features/transactions/types/transaction.types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [openTransactionForm, setOpenTransactionForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const handleCreate = () => {
    setSelectedTransaction(null);
    setOpenTransactionForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenTransactionForm(true);
  };

  return (
    <main>
      <h1>Transactions</h1>

      <Button onClick={handleCreate}>Add Transaction</Button>

      <TransactionForm
        openTransactionForm={openTransactionForm}
        setOpenTransactionForm={setOpenTransactionForm}
        transactionToEdit={selectedTransaction}
        setTransactionToEdit={setSelectedTransaction}
      />

      {isLoading && <p>Loading transactions...</p>}
      {error && <p>Failed to load transactions</p>}

      {!isLoading && !error && (
        <>
          {!data?.length ? (
            <p>No transactions yet</p>
          ) : (
            data.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
              />
            ))
          )}
        </>
      )}
    </main>
  );
}
