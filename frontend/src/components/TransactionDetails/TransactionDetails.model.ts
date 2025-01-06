export interface NewTransactionProps {
    show: boolean;
    onHide: () => void;
    loggedInAccountId: string;
    toAccountId: string;
}
