import { useMemo } from 'react';
import { IEnrichedTransaction, TransactionType } from '../../shared/store/slices/transaction.slice.ts';

export const useTransactionCardViewModel = (transaction: IEnrichedTransaction) => {
    const borderColor = useMemo(() => {
        switch (transaction.type) {
            case TransactionType.WITHDRAW:
                return 'red';
            case TransactionType.DEPOSIT:
                return 'green';
            default:
                return '#ccc';
        }
    }, [transaction.type]);

    const formattedStatus = useMemo(() => {
        switch (transaction.status) {
            case 'COMPLETED':
                return { text: 'Completed', color: 'green' };
            case 'PENDING':
                return { text: 'Pending', color: 'orange' };
            case 'FAILED':
                return { text: 'Failed', color: 'red' };
            default:
                return { text: transaction.status, color: '#000' };
        }
    }, [transaction.status]);

    return {
        borderColor,
        formattedStatus,
    };
};
