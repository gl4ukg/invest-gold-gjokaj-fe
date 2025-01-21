export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id?: string;
    userId?: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
