import { z } from 'zod';

export interface TransactionData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  dueDate?: string;
}

export interface TransactionFormState {
  amount: number | string;
  dueDate?: string;
}


export interface NewTransactionProps {
  show: boolean;
  onHide: () => void;
  loggedInAccountId: string;
  toAccountId: string;
}


export const transactionSchema = z.object({
  fromAccountId: z.string().min(1, "From account ID is required"),
  toAccountId: z.string().min(1, "To account ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  dueDate: z.string().nullable().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "DueDate deve ser uma data válida",
  }).optional(),
});
