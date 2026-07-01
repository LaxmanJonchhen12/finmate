"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/transactions";
import TransactionForm from "../features/transactions/components/TransactionForm";
import TransactionCard from "../features/transactions/components/TransectionCard";
import { useState } from "react";
import { Transaction } from "../features/transactions/types/transaction.types";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [filter, setFilter] = useState("");
  console.log(filter, "filter");
  const [openTransactionForm, setOpenTransactionForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: () => getTransactions(filter),
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

      <FieldLabel>Transacton Type</FieldLabel>

      <Select
        onValueChange={(value) => {
          setFilter(value as string);
        }}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
