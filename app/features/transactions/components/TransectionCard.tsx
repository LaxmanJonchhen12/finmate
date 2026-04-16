import { useDeleteTransaction } from "../hooks/useDeleteTransection";
import DeleteTransactionDailog from "./DeleteTransactionDailog";
export default function TransactionCard({
  id,
  note,
  amount,
  type,
}: {
  id: string;
  note: string;
  amount: number;
  type: "income" | "expense";
}) {
  const { mutate, isPending } = useDeleteTransaction();
  const handleDelete = () => {
    mutate(id);
  };
  return (
    <div className="">
      <p>{note}</p>
      <p>{amount}</p>
      <p>{type}</p>
      <DeleteTransactionDailog onDelete={handleDelete} />
    </div>
  );
}
