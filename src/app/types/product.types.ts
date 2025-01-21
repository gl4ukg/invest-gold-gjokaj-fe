export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    image?: string;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}
