export interface Account {
    id: string;
    name: string;
    balance: number;
    isActive: boolean;
    avatarUrl: string;
}

export interface CardAccountProps {
    account: Account;
    onAddTransaction: (accountId: string) => void;
}