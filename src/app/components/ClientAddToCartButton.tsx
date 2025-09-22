"use client";
import { useCart } from "@/app/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { Product } from "@/app/types/product.types";

export default function ClientAddToCartButton({
  product,
  label,
}: {
  product: Product;
  label: string;
}) {
  const { addToCart } = useCart();
  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
      aria-label={label}
    >
      <FaShoppingCart />
      <span>{label}</span>
    </button>
  );
}
