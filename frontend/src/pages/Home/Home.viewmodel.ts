import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../shared/store/store.ts';
import { useHeaderViewModel } from '../../components/Header/Header.viewmodel.ts';
import { fetchAccounts } from '../../shared/api.ts';
import { setLoggedInAccount } from '../../shared/store/slices/account.slice.ts';
import { enrichTransaction } from '../../shared/store/slices/transaction.slice.ts';

export const useHomeViewModel = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { accounts, transactions, loading, error, loggedInAccountId } = useSelector(
        (state: RootState) => state.account,
    );
    const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

    const { loggedInAccountName, onLogout } = useHeaderViewModel();

    useEffect(() => {
        if (accounts.length <= 0) {
            dispatch(fetchAccounts());
        }
    }, [dispatch, accounts.length]);

    useEffect(() => {
        if (accounts.length > 0 && !loggedInAccountId) {
            const randomIndex = Math.floor(Math.random() * accounts.length);
            const randomAccount = accounts[randomIndex];
            dispatch(setLoggedInAccount(randomAccount.id));
        }
    }, [accounts, loggedInAccountId, dispatch]);

    const otherAccounts = useMemo(
        () => accounts.filter((account) => account.id !== loggedInAccountId),
        [accounts, loggedInAccountId],
    );

    const accountTransactions = useMemo(
        () =>
            transactions
                .filter((transaction) => {
                    if (transaction.toAccountId === loggedInAccountId && transaction.type === 'DEPOSIT') {
                        return true;
                    }
                    if (transaction.fromAccountId === loggedInAccountId && transaction.type === 'WITHDRAW') {
                        return true;
                    }
                    return false;
                })
                .map((transaction) => enrichTransaction(transaction, accounts)),
        [transactions, loggedInAccountId, accounts],
    );

    const handleDetails = (transactionId: string) => {
        setCurrentTransactionId(transactionId);
        setShowTransactionDetails(true);
    };

    const handleAddTransaction = (accountId: string) => {
        setSelectedAccountId(accountId);
        setShowNewTransactionModal(true);
    };

    const handleHideTransactionDetails = () => {
        setShowTransactionDetails(false);
    };

    const handleHideNewTransaction = () => {
        setShowNewTransactionModal(false);
    };

    return {
        otherAccounts,
        accountTransactions,
        loading,
        error,
        loggedInAccountId,
        loggedInAccountName,
        currentTransactionId,
        showTransactionDetails,
        showNewTransactionModal,
        selectedAccountId,

        handleDetails,
        handleAddTransaction,
        handleHideTransactionDetails,
        handleHideNewTransaction,
        onLogout,
    };
};
