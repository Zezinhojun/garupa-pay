import { createAsyncThunk } from "@reduxjs/toolkit/react";
import axios from "axios";
import { toast } from "react-toastify";
import { enrichTransaction, IEnrichedTransaction, ITransaction } from "./store/slices/transaction.slice.ts";
import { RootState } from "./store/store.ts";
import { IAccount } from "./store/slices/account.slice.ts";

interface CreateTransaction {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    dueDate?: string | null;
}

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { data } = error.response;
            if (data.error_code && data.error_description) {
                toast.error(`Erro: ${data.error_description}`);
            } else {
                toast.error('Ocorreu um erro. Tente novamente mais tarde.');
            }
        } else {
            toast.error('Erro inesperado. Tente novamente mais tarde.');
        }
        return Promise.reject(error);
    },
);

export const createTransaction = createAsyncThunk(
    'account/createTransaction',
    async (transaction: CreateTransaction, { rejectWithValue }) => {
        try {
            const response = await api.post("/transactions", transaction);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erro ao criar transação');
        }
    }
);

export const fetchTransactionById = createAsyncThunk<
    IEnrichedTransaction,
    string,
    { state: RootState }
>(
    'transaction/fetchById',
    async (transactionId: string, { getState, rejectWithValue }) => {
        try {
            const response = await api.get(`/transactions/${transactionId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch transaction');
            }
            const transaction: ITransaction = response.data;
            const accounts = getState().account.accounts;
            const enrichedTransaction = enrichTransaction(transaction, accounts);

            return enrichedTransaction;
        } catch {
            return rejectWithValue("Não foi possível carregar a transaction");
        }
    }
);

export const fetchAccounts = createAsyncThunk<IAccount[], void, { rejectValue: string }>(
    'account/fetchAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/accounts');

            if (!response.data || response.data.length === 0) {
                const errorMessage = 'Não há contas disponíveis';
                toast.error(errorMessage);
                return rejectWithValue(errorMessage);
            }

            return response.data;
        } catch {
            return rejectWithValue('Não foi possível carregar os accounts');
        }
    }
);

