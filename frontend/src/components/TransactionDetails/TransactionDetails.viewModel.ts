import { useEffect, useMemo, useState } from "react";
import { clearSelectedTransaction, StatusTransaction, TransactionState } from "../../shared/store/slices/transaction.slice.ts";
import { AppDispatch } from "../../shared/store/store.ts";
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionById } from "../../shared/api.ts";

export const useTransactionDetailsViewModel = (transactionId: string | null) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedTransaction: transaction, loading, error } = useSelector(
        (state: { transaction: TransactionState }) => state.transaction
    );

    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    useEffect(() => {
        if (transactionId) {
            dispatch(fetchTransactionById(transactionId));
        }
        return () => {
            dispatch(clearSelectedTransaction());
        };
    }, [dispatch, transactionId]);

    const handleCloseDetails = () => {
        setShowTransactionDetails(false);
        dispatch(clearSelectedTransaction());
    };

    const formattedAmount = useMemo(() => {
        if (!transaction?.amount) return "";
        return new Intl.NumberFormat('pt-BR', {
            style: "currency",
            currency: 'BRL'
        }).format(transaction.amount);
    }, [transaction?.amount])

    const formattedCreatedAt = useMemo(() => {
        if (!transaction?.createdAt) return "";
        return format(new Date(transaction.createdAt), 'dd/MM/yyy');
    }, [transaction?.createdAt]);

    const formattedDueDate = useMemo(() => {
        if (!transaction?.dueDate) return "";
        return format(new Date(transaction.dueDate), 'dd/MM/yyy');
    }, [transaction?.dueDate]);

    const fromAccount = useMemo(() => ({
        id: transaction?.fromAccountId || '',
        name: transaction?.fromAccountName || ''
    }), [transaction?.fromAccountId, transaction?.fromAccountName]);

    const toAccount = useMemo(() => ({
        id: transaction?.toAccountId || '',
        name: transaction?.toAccountName || ''
    }), [transaction?.toAccountId, transaction?.toAccountName]);

    const statusConfig = useMemo(() => {
        const statusStyles: { [key: string]: { color: string; text: string } } = {
            [StatusTransaction.COMPLETED]: { color: 'bg-green-500', text: 'Concluído' },
            [StatusTransaction.PENDING]: { color: 'bg-yellow-500', text: 'Pendente' },
            [StatusTransaction.FAILED]: { color: 'bg-red-500', text: 'Falhou' },
        };

        const status = transaction?.status || '';
        return statusStyles[status] || { color: 'bg-gray-500', text: status };
    }, [transaction?.status]);

    return {
        loading,
        error,
        showTransactionDetails,
        handleCloseDetails,
        formattedAmount,
        formattedCreatedAt,
        formattedDueDate,
        fromAccount,
        toAccount,

        status: {
            ...statusConfig
        },
        type: transaction?.type || '',
        id: transaction?.id || '',
        isValid: transaction !== null
    };

}