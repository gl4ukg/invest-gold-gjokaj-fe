import { ConfiguredProduct, Product } from './product.types';
import { ConfiguratorState } from './configurator';

export interface CartItem {
    id?: string;
    product: Product;
    configuration?: ConfiguratorState;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
    selectedItemId?: string; // To track which item's configuration is being viewed/edited
}

export interface CartContextType {
    cart: Cart;
    addToCart: (product: Product, quantity?: number, configuration?: ConfiguratorState) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    updateConfiguration: (productId: string, configuration: ConfiguratorState) => void;
    selectCartItem: (productId: string | undefined) => void;
    clearCart: () => void;
    itemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isLoading: boolean;
}