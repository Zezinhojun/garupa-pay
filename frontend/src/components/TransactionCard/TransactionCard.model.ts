import { IEnrichedTransaction } from "../../shared/store/slices/transaction.slice.ts";

export interface TransactionCardProps {
    transaction: IEnrichedTransaction;
    onDetails: (transactionId: string) => void;
}
