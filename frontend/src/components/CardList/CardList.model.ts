export interface CardListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}