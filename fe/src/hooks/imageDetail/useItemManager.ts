import { useState } from "react";

export function useItemManager<T extends { id: number }>(initialItems: T[]) {
    const [items, setItems] = useState<T[]>(initialItems);

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const addItem = (newItem: T) => {
        setItems((prev) => {
            const exists = prev.some((item) => item.id === newItem.id);
            if (!exists) {
                return [...prev, newItem];
            }
            return prev;
        });
    };

    const addItems = (newItems: T[]) => {
        setItems((prev) => [...prev, ...newItems]);
    };

    return {
        items,
        setItems,
        removeItem,
        addItem,
        addItems,
    };
}
