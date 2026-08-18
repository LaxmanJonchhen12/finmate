interface TransactionSummaryProps {
 transactionType: string;
 totalAmount: number;
}


export default function TransactionSummary({ transactionType, totalAmount }: TransactionSummaryProps) {
    return(
        <div>
            <h2 className="text-lg font-semibold mb-4">Transaction Summary</h2>
            <p>Transaction Type: {transactionType}</p>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        </div>
    )
}