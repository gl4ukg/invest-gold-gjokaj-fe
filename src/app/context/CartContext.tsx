'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartContextType, CartItem } from '../types/cart.types';
import { Product } from '../types/product.types';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const initialCart: Cart = {
    items: [],
    total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(initialCart);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const t = useTranslations();

    // Load cart from localStorage on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCart();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const calculateTotal = (items: CartItem[]) => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const addToCart = (product: Product, quantity: number = 1) => {
        if (product.stock === 0) {
            toast.error(t('notifications.outOfStock'));
            return;
        }

        let shouldShowToast = true;

        setCart(currentCart => {
            const existingItem = currentCart.items.find(item => item.product.id === product.id);

            if (existingItem) {
                // Check if adding more would exceed stock
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    shouldShowToast = false;
                    toast.error(t('notifications.exceedsStock'));
                    return currentCart;
                }

                const newItems = currentCart.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                return {
                    items: newItems,
                    total: calculateTotal(newItems)
                };
            } else {
                // Check if initial quantity exceeds stock
                if (quantity > product.stock) {
                    shouldShowToast = false;
                    toast.error(t('notifications.exceedsStock'));
                    return currentCart;
                }

                const newItems = [...currentCart.items, { product, quantity }];
                return {
                    items: newItems,
                    total: calculateTotal(newItems)
                };
            }
        });

        if (shouldShowToast) {
            toast.success(t('notifications.productAdded'));
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(currentCart => {
            const newItems = currentCart.items.filter(item => item.product.id !== productId);
            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        });
        toast.success(t('notifications.productRemoved'));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        let shouldShowToast = true;

        setCart(currentCart => {
            const item = currentCart.items.find(item => item.product.id === productId);
            if (!item) return currentCart;

            // Check if new quantity exceeds stock
            if (quantity > item.product.stock) {
                shouldShowToast = false;
                toast.error(t('notifications.exceedsStock'));
                return currentCart;
            }

            const newItems = currentCart.items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            );

            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        });

        if (shouldShowToast) {
            toast.success(t('notifications.cartUpdated'));
        }
    };

    const clearCart = () => {
        setCart(initialCart);
        toast.success(t('notifications.cartCleared'));
    };

    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemCount,
            isCartOpen,
            setIsCartOpen,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};