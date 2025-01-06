export interface Transaction {
    id: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    dueDate: string;
    fromAccountId: string;
    fromAccountName: string;
    toAccountId: string;
    toAccountName: string;
    status: string;
    type: string;
}
