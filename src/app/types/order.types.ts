import { OrderStatus } from "../services/orders";

export interface IOrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id?: string;
    userId?: string;
    items: IOrderItem[];
    total: number;
    status: OrderStatus;
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
