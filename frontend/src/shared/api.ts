import { createAsyncThunk } from "@reduxjs/toolkit/react";
import axios from "axios";
import { toast } from "react-toastify";

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
