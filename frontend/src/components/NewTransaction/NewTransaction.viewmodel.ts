import { useMemo, useState } from 'react';
import { TransactionFormState, transactionSchema } from './NewTransaction.model.ts';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { AppDispatch } from '../../shared/store/store.ts';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../../shared/api.ts';

export const useNewTransactionViewModel = (loggedInAccountId: string, toAccountId: string, onHide: () => void) => {
    const dispatch = useDispatch<AppDispatch>()
    const [formState, setFormState] = useState<TransactionFormState>({
        amount: '',
        dueDate: '',
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const transactionData = useMemo(() => {
        const { amount, dueDate } = formState;
        return {
            fromAccountId: loggedInAccountId,
            toAccountId,
            amount: parseFloat(amount as string),
            dueDate: dueDate?.trim() === '' ? '' : dueDate,
        };
    }, [formState, loggedInAccountId, toAccountId]);

    const handleSubmit = async () => {
        try {
            transactionSchema.parse(transactionData);
            await dispatch(createTransaction(transactionData));
            setFormState({
                amount: '',
                dueDate: '',
            });
            toast.success('Transação criada com sucesso!');
            onHide();
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrorMessage(error.errors[0]?.message || 'Erro na transação');
            } else {
                setErrorMessage('Erro inesperado. Tente novamente.');
            }
        }
    };

    return {
        formState,
        errorMessage,
        handleInputChange,
        handleSubmit,
    };
};
