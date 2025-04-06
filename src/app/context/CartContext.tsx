'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartContextType, CartItem } from '../types/cart.types';
import { Product } from '../types/product.types';
import { ConfiguratorState } from '../types/configurator';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const initialCart: Cart = {
    items: [],
    total: 0,
    selectedItemId: undefined
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const initialConfiguratorState: ConfiguratorState = {
    selectedProfile: null,
    dimensions: {
        profileWidth: 0,
        profileHeight: 0,
        ringSize: 0,
        ringSizeSystem: '',
    },
    preciousMetal: {
        colorType: '',
        shape: undefined,
        colors: [{
            metalColor: '',
            polishType: '',
            fineness: ''
        }]
    },
    stoneSettings: {
        settingType: '',
        stoneType: '',
        stoneSize: '',
        stoneQuality: '',
        numberOfStones: 0,
        spacing: '',
        position: ''
    },
    groovesAndEdges: {
        groove: {
            grooveType: '',
            width: 0,
            depth: 0,
            surface: '',
            alignment: ''
        },
        leftEdge: {
            type: ''
        },
        rightEdge: {
            type: ''
        }
    },
    engraving: {
        text: '',
        fontFamily: 'Times New Roman'
    },
    weight: 0
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(initialCart);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [configuratorState, setConfiguratorState] = useState<ConfiguratorState>(initialConfiguratorState);
    const [activeTab, setActiveTab] = React.useState<'grooves' | 'edges'>('grooves');

    const t = useTranslations();

    // Load cart from localStorage on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    // If there are items but none is selected, select the first one
                    if (parsedCart.items.length > 0 && !parsedCart.selectedItemId) {
                        parsedCart.selectedItemId = parsedCart.items[0].id;
                    }
                    setCart(parsedCart);
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
        return items.reduce((total, item) => {
            // If item has configuration with weight, use weight × 70€
            if (item.configuration?.weight) {
                return total + (item.configuration.weight * 70 * Number(item?.quantity));
            }
            // Fallback to product price if no weight configuration
            return 0;
        }, 0);
    };

    const addToCart = (product: Product, quantity: number = 1, configuration?: ConfiguratorState) => {
        if (product.stock === 0) {
            toast.error(t('notifications.outOfStock'));
            return;
        }

        // Check if adding would exceed stock
        const currentQuantityInCart = cart.items.filter(item => item.product.id === product.id).length;
        if (currentQuantityInCart + 1 > product.stock) {
            toast.error(t('notifications.exceedsStock'));
            return;
        }

        setCart(currentCart => {
            // Always add as a new item with unique ID
            const newItem = {
                id: Date.now().toString(), // Unique ID for each item
                product,
                configuration,
                quantity: 1 // Always 1 since we're adding separate items
            };
            const newItems = [...currentCart.items, newItem];
            
            return {
                items: newItems,
                total: calculateTotal(newItems),
                selectedItemId: currentCart.items.length === 0 ? newItem.id : currentCart.selectedItemId
            };
        });

        toast.success(t('notifications.productAdded'));
    };

    const removeFromCart = (productId: string) => {
        setCart(currentCart => {
            const newItems = currentCart.items.filter(item => item.id !== productId);
            // If the removed item was selected, select the first remaining item
            const wasSelectedItem = currentCart.selectedItemId && currentCart.items.find(item => item.id === productId)?.id === currentCart.selectedItemId;
            return {
                items: newItems,
                total: calculateTotal(newItems),
                selectedItemId: wasSelectedItem ? (newItems[0]?.id || undefined) : currentCart.selectedItemId
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

            const newItems = currentCart.items?.map(item =>
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

    const updateConfiguration = (productId: string, configuration: ConfiguratorState) => {
        setCart(currentCart => {
            const newItems = currentCart.items.map(item =>
                item.id === productId
                    ? { ...item, configuration }
                    : item
            );

            return {
                ...currentCart,
                items: newItems,
                total: calculateTotal(newItems)
            };
        });
        toast.success(t('notifications.configurationUpdated'));
    };

    const selectCartItem = (productId: string | undefined) => {
        setCart(prev => ({
            ...prev,
            selectedItemId: productId
        }));
    };

    const clearCart = () => {
        setCart(initialCart);
        setConfiguratorState({
            selectedProfile: null,
            dimensions: {
                profileWidth: 0,
                profileHeight: 0,
                ringSize: 0,
                ringSizeSystem: '',
            },
            preciousMetal: {
                colorType: '',
                shape: undefined,
                colors: [{
                    metalColor: '',
                    polishType: '',
                    fineness: ''
                }]
            },
            stoneSettings: {
                settingType: '',
                stoneType: '',
                stoneSize: '',
                stoneQuality: '',
                numberOfStones: 0,
                spacing: '',
                position: ''
            },
            groovesAndEdges: {
                groove: {
                    grooveType: '',
                    width: 0,
                    depth: 0,
                    surface: '',
                    alignment: ''
                },
                leftEdge: {
                    type: ''
                },
                rightEdge: {
                    type: ''
                }
            },
            engraving: {
                text: '',
                fontFamily: 'Times New Roman'
            },
            weight: 0
        })
        toast.success(t('notifications.cartCleared'));
    };

    const itemCount = cart.items.reduce((count, item) => count + Number(item?.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            configuratorState,
            setConfiguratorState,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemCount,
            isCartOpen,
            setIsCartOpen,
            isLoading,
            updateConfiguration,
            selectCartItem,
            activeTab,
            setActiveTab
        }}>
            {children}
        </CartContext.Provider>
    );
};