import { Category } from "./category.types";
import { ConfiguratorState } from "./configurator";

export interface ConfiguredProduct extends Product {
    configuration: ConfiguratorState;
}

export interface Product {
    id?: string | number;
    name: string;
    description: string;
    price?: number;
    weight: string;
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