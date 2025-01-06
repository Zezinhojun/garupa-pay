import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";
import { IAccount } from "./account.slice.ts";
import { fetchTransactionById } from "../../api.ts";

export enum StatusTransaction {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}
export enum TransactionType {
    WITHDRAW = "WITHDRAW",
    DEPOSIT = "DEPOSIT",
}

export interface ITransaction {
    id: string;
    amount: number;
    createdAt: string;
    dueDate: string;
    fromAccountId: string;
    toAccountId: string;
    status: StatusTransaction;
    type: TransactionType;
    updatedAt: string;
}

export interface IEnrichedTransaction extends ITransaction {
    fromAccountName: string;
    toAccountName: string;
}

export interface TransactionState {
    selectedTransaction: IEnrichedTransaction | null;
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    selectedTransaction: null,
    loading: false,
    error: null,
};

export const enrichTransaction = (transaction: ITransaction, accounts: IAccount[]): IEnrichedTransaction => {
    const accountMap = new Map(accounts.map(account => [account.id, account.name]));

    return {
        ...transaction,
        fromAccountName: accountMap.get(transaction.fromAccountId) || 'Unknown',
        toAccountName: accountMap.get(transaction.toAccountId) || 'Unknown'
    };
};

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        clearSelectedTransaction: (state) => {
            state.selectedTransaction = null;
        },
        addTransaction: (state, action: PayloadAction<IEnrichedTransaction>) => {
            if (!state.selectedTransaction) {
                state.selectedTransaction = action.payload;
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTransaction = action.payload;
            })
            .addCase(fetchTransactionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erro ao buscar transação';
            });
    }
});

export const { clearSelectedTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;