'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartContextType, CartItem } from '../types/cart.types';
import { Product } from '../types/product.types';
import { toast } from 'react-hot-toast';

const initialCart: Cart = {
    items: [],
    total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(initialCart);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const calculateTotal = (items: CartItem[]): number => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const addToCart = (product: Product, quantity: number = 1) => {
        if (product.stock === 0) {
            toast.error('This product is out of stock');
            return;
        }

        setCart(currentCart => {
            const existingItem = currentCart.items.find(item => item.product.id === product.id);
            
            let newItems: CartItem[];
            if (existingItem) {
                // Check if adding more would exceed stock
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    toast.error(`Cannot add more than ${product.stock} items`);
                    return currentCart;
                }

                newItems = currentCart.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                // Check if initial quantity exceeds stock
                if (quantity > product.stock) {
                    toast.error(`Cannot add more than ${product.stock} items`);
                    return currentCart;
                }

                newItems = [...currentCart.items, { product, quantity }];
            }

            const newTotal = calculateTotal(newItems);
            toast.success('Product added to cart');
            
            return {
                items: newItems,
                total: newTotal
            };
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(currentCart => {
            const newItems = currentCart.items.filter(item => item.product.id !== productId);
            const newTotal = calculateTotal(newItems);
            toast.success('Product removed from cart');
            
            return {
                items: newItems,
                total: newTotal
            };
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart(currentCart => {
            const item = currentCart.items.find(item => item.product.id === productId);
            if (!item) return currentCart;

            // Check if new quantity exceeds stock
            if (quantity > item.product.stock) {
                toast.error(`Cannot add more than ${item.product.stock} items`);
                return currentCart;
            }

            const newItems = currentCart.items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            );

            const newTotal = calculateTotal(newItems);
            return {
                items: newItems,
                total: newTotal
            };
        });
    };

    const clearCart = () => {
        setCart(initialCart);
        toast.success('Cart cleared');
    };

    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    const value: CartContextType = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;