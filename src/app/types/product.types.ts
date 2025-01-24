import { Category } from "./category.types";

export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image?: string;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateProduct {
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
    categoryId: string;
}