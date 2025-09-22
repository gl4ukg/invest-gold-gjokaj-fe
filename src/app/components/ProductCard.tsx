"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "../context/CartContext";
import { FaCartShopping } from "react-icons/fa6";
import { Product } from "../types/product.types";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  priorityImage?: boolean;
}
export default function ProductCard({
  product,
  showAddToCart = true,
  priorityImage = false,
}: ProductCardProps) {
  const href = `/unaza/${product.id}`;
  const t = useTranslations();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 h-full">
      <Link
        href={href}
        aria-label={`Unaza: ${product.name}, ${product.category?.name}`}
      >
        <figure className="relative h-32 md:h-64">
          <Image
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={`${product.name}${
              product.weight ? `, ${product.weight}g` : ""
            }`}
            fill
            priority={priorityImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        </figure>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-0 text-darkGray">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {product.category?.name && (
          <p className="text-xs text-lightGray mb-2">{product.category.name}</p>
        )}

        <div className="flex justify-between items-center">
          {product.weight ? (
            <span className="text-sm md:text-lg font-bold text-lightGray">
              {product.weight} g
            </span>
          ) : (
            <span />
          )}

          {showAddToCart &&
            (product.stock && product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white p-2 md:px-4 md:py-2 rounded-lg "
                aria-label={t("product.addToCart")}
              >
                <FaCartShopping className="text-white text-sm md:text-lg" />
              </button>
            ) : (
              <span className="text-primary">Out of stock</span>
            ))}
        </div>
      </div>
    </article>
  );
}
