import { Product } from './product.types';
import { ConfiguratorState } from './configurator';
import { Dispatch, SetStateAction } from 'react';

export interface CartItem {
    id?: string;
    product: Product;
    configuration?: ConfiguratorState;
    quantity?: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
    selectedItemId?: string;
}

export type GroovesAndEdgesTab = 'grooves' | 'edges';

export interface CartContextType {
    cart: Cart;
    isCartOpen: boolean;
    setIsCartOpen: Dispatch<SetStateAction<boolean>>
    isLoading: boolean;
    configuratorState: ConfiguratorState;
    setConfiguratorState: (state: ConfiguratorState) => void;
    addToCart: (product: Product, quantity?: number, configuration?: ConfiguratorState) => void;
    removeFromCart: (productId: string) => void;
    selectCartItem: (id?: string) => void;
    updateConfiguration: (productId: string, configuration: ConfiguratorState) => void;
    activeTab: GroovesAndEdgesTab;
    setActiveTab: (tab: GroovesAndEdgesTab) => void;
    clearCart: () => void;
    itemCount: number;
    isNavbarOpen: boolean;
    setIsNavbarOpen: Dispatch<SetStateAction<boolean>>;
}