"use client";

import { useState } from "react";

export interface Authority {
    name: string;
    department: string;
}

export function useItemManager<T>(initialItems: T[]) {
    const [items, setItems] = useState<T[]>(initialItems);

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const addItem = (
        newItem: T,
        checkDuplicate?: (items: T[], newItem: T) => boolean
    ) => {
        if (!checkDuplicate || !checkDuplicate(items, newItem)) {
            setItems([...items, newItem]);
        }
    };

    return {
        items,
        setItems,
        removeItem,
        addItem,
    };
}
