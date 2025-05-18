export interface Product {
  id: string | number;
  name: string;
  description: string;
  images: string[];
  price: number;
  category?: string;
}
