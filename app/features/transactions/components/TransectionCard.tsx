import { Button } from "@/components/ui/button";
import { useDeleteTransaction } from "../hooks/useDeleteTransection";
import DeleteTransactionDailog from "./DeleteTransactionDailog";
import { Transaction } from "../types/transaction.types";

type TransactionCardProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
};

export default function TransactionCard({
  transaction,
  onEdit,
}: TransactionCardProps) {
  const { mutate } = useDeleteTransaction();

  const handleDelete = () => {
    if (transaction.id) {
      mutate(transaction.id);
    }
  };

  return (
    <div className="">
      <p>{transaction.note}</p>
      <p>{transaction.amount}</p>
      <p>{transaction.type}</p>

      <Button onClick={() => onEdit(transaction)}>Edit</Button>
      <DeleteTransactionDailog onDelete={handleDelete} />
    </div>
  );
}
