import { useMemo } from "react";

export const useCardListViewModel = <T,>(items: T[]) => {
    const isEmpty = useMemo(() => items.length === 0, [items])

    return {
        isEmpty,
        totalItems: items.length
    };
};