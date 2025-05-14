import { Category } from "./category.types";
import { ConfiguratorState } from "./configurator";

export interface Product {
    id?: string | number;
    name: string;
    description: string;
    price?: number;
    weight: string;
    category: Category;
    images?: string[];
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
    configuration: ConfiguratorState;
}

export interface CreateProduct {
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
    categoryId: string;
}