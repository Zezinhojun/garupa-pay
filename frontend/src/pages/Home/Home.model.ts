import { TransactionType } from "../../shared/store/slices/transaction.slice";

export interface IHomeModel {
    accounts: Account[];
    transactions: Transaction[];
    loggedInAccountId: string | null;
    loading: boolean;
    error: string | null;
}

export interface Account {
    id: string;
    name: string;
}

export interface Transaction {
    id: string;
    toAccountId: string;
    fromAccountId: string;
    type: TransactionType;
}