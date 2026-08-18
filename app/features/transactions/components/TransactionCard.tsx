import { Button } from "@/components/ui/button";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import { Transaction } from "../types/transaction.types";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

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
      <DeleteTransactionDialog onDelete={handleDelete} />
    </div>
  );
}
