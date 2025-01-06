import { useMemo } from "react";
import { Account } from "./AccountCard.model";

export const useAccountCardViewModel = (account: Account) => {
    const { avatarUrl, isActive } = account;

    const { statusColor, statusText } = useMemo(() => {
        const statusColor = isActive ? 'green' : 'red';
        const statusText = isActive ? 'Active' : 'Inactive';

        return { statusColor, statusText };
    }, [isActive]);

    return {
        statusColor,
        statusText,
        avatarUrl,
    };
};
