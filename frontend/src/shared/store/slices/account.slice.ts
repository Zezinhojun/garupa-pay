import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";
import { createTransaction, fetchAccounts } from "../../api.ts";
import { IEnrichedTransaction, ITransaction } from "./transaction.slice.ts";

export interface IAccount {
    id: string;
    name: string;
    userCpf: string;
    balance: number;
    isActive: boolean;
    transactions: ITransaction[];
    createdAt: string;
    updatedAt: string;
    avatarUrl: string;
}

interface AccountState {
    accounts: IAccount[];
    transactions: ITransaction[];
    loggedInAccountId: string | null;
    loading: boolean;
    error: string | null;
    transactionLoading: boolean;
    transactionError: string | null;
}

const initialState: AccountState = {
    accounts: [],
    transactions: [],
    loggedInAccountId: null,
    loading: false,
    error: null,
    transactionLoading: false,
    transactionError: null,
};

const generateAvatarUrl = (accountId: string) => {
    const baseAvatarUrl = 'https://www.w3schools.com/w3images/avatar';
    const lastChar = accountId.slice(-1);
    const avatarId = isNaN(Number(lastChar)) ? 1 : parseInt(lastChar, 10) % 6 + 1;

    return `${baseAvatarUrl}${avatarId}.png`;
};

const enrichAccountsWithAvatars = (accounts: IAccount[]): IAccount[] => {

    return accounts.map(account => ({
        ...account,
        avatarUrl: generateAvatarUrl(account.id),
    }));
}

const enrichTransactionsWithNames = (accounts: IAccount[], transactions: ITransaction[]): IEnrichedTransaction[] => {
    const accountMap = new Map(accounts.map(account => [account.id, account.name]));

    return transactions.map(transaction => ({
        ...transaction,
        fromAccountName: accountMap.get(transaction.fromAccountId) || 'Unknown',
        toAccountName: accountMap.get(transaction.toAccountId) || 'Unknown',
    }));
}

export const extractTransactionsFromAccounts = (accounts: IAccount[]): ITransaction[] => {
    return accounts.reduce((acc, account) => [...acc, ...account.transactions], [] as ITransaction[]);
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccounts: (state, action: PayloadAction<IAccount[]>) => {
            state.accounts = enrichAccountsWithAvatars(action.payload);
            const allTransactions = extractTransactionsFromAccounts(action.payload);
            state.transactions = enrichTransactionsWithNames(action.payload, allTransactions);
        },

        addAccount: (state, action: PayloadAction<IAccount>) => {
            const enrichedAccount = {
                ...action.payload,
                avatarUrl: generateAvatarUrl(action.payload.id),
            };
            state.accounts.push(enrichedAccount);
            if (enrichedAccount.transactions) {
                state.transactions.push(
                    ...enrichTransactionsWithNames(
                        state.accounts,
                        enrichedAccount.transactions
                    )
                );
            }
        },
        setLoggedInAccount(state, action: PayloadAction<string>) {
            state.loggedInAccountId = action.payload;
        },

        updateAccountStatus: (state, action: PayloadAction<{ accountId: string; isActive: boolean }>) => {
            const account = state.accounts.find(acc => acc.id === action.payload.accountId);
            if (account) {
                account.isActive = action.payload.isActive;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = enrichAccountsWithAvatars(action.payload);
                const allTransactions = extractTransactionsFromAccounts(action.payload);
                state.transactions = enrichTransactionsWithNames(action.payload, allTransactions);
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Erro desconhecido';
            })

            .addCase(createTransaction.pending, (state) => {
                state.transactionLoading = true;
                state.transactionError = null;
            })

            .addCase(createTransaction.fulfilled, (state, action) => {
                state.transactionLoading = false;

                const enrichedTransaction = enrichTransactionsWithNames(
                    state.accounts,
                    [action.payload]
                )[0];

                state.transactions.unshift(enrichedTransaction);

                const fromAccount = state.accounts.find(
                    acc => acc.id === action.payload.fromAccountId
                );
                const toAccount = state.accounts.find(
                    acc => acc.id === action.payload.toAccountId
                );

                if (fromAccount) {
                    fromAccount.balance -= action.payload.amount;
                    fromAccount.transactions = [action.payload, ...fromAccount.transactions];
                }

                if (toAccount) {
                    toAccount.balance += action.payload.amount;
                    toAccount.transactions = [action.payload, ...toAccount.transactions];
                }
            })

            .addCase(createTransaction.rejected, (state, action) => {
                state.transactionLoading = false;
                state.transactionError = action.payload as string ?? 'Erro ao criar transação';
            });
    },
})

export const { setAccounts, addAccount, updateAccountStatus, setLoggedInAccount } = accountSlice.actions;
export default accountSlice.reducer;