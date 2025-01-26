import { Product } from './product.types';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

export interface CartContextType {
    cart: Cart;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isLoading: boolean;
}