import { toast } from 'react-toastify';
import { RootState } from '../../shared/store/store';
import { setLoggedInAccount } from '../../shared/store/slices/account.slice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useHeaderViewModel = () => {
    const dispatch = useDispatch();
    const { accounts, loggedInAccountId } = useSelector((state: RootState) => state.account);

    const loggedInAccount = useMemo(() => {
        return accounts.find((account) => account.id === loggedInAccountId);
    }, [accounts, loggedInAccountId]);

    const availableAccounts = useMemo(() => {
        return accounts.filter(
            (account) => account.isActive === true && account.id !== loggedInAccountId
        );
    }, [accounts, loggedInAccountId]);

    const handleLogout = () => {
        if (availableAccounts.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableAccounts.length);
            const newAccount = availableAccounts[randomIndex];
            dispatch(setLoggedInAccount(newAccount.id));
            toast.success(`Conta trocada com sucesso! Agora você está logado como ${newAccount.name}.`);
        } else {
            toast.error('Não há contas ativas para trocar.');
        }
    };

    return {
        loggedInAccountName: loggedInAccount?.name || '',
        onLogout: handleLogout,
    };
};
