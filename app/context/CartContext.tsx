"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId?: string;
    selectedVariants?: Record<string, string>;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (index: number) => void;
    removeOne: (index: number) => void;
    clearCart: () => void;
    total: number;
    subtotal: number;
    count: number;
    deliveryFee: number;
    setDeliveryFee: (fee: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [deliveryFee, setDeliveryFee] = useState<number>(0);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            // Find existing with same ID AND same variants
            const existingIndex = prev.findIndex(i =>
                i.id === product.id &&
                JSON.stringify(i.selectedVariants) === JSON.stringify(product.selectedVariants)
            );

            if (existingIndex > -1) {
                const newItems = [...prev];
                newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 };
                return newItems;
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (index: number) => {
        setItems(prev => prev.filter((_, idx) => idx !== index));
    };

    const removeOne = (index: number) => {
        setItems(prev => {
            const item = prev[index];
            if (item && item.quantity > 1) {
                const newItems = [...prev];
                newItems[index] = { ...item, quantity: item.quantity - 1 };
                return newItems;
            }
            return prev.filter((_, idx) => idx !== index);
        });
    };

    const clearCart = () => {
        setItems([]);
        setDeliveryFee(0);
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, removeOne, clearCart, total, subtotal, count, deliveryFee, setDeliveryFee }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
