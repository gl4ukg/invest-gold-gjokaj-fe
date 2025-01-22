'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { Link } from '@/i18n/routing';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    const t = useTranslations('cart');
    const { cart, removeFromCart, updateQuantity, itemCount } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Cart panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md">
                <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <FaShoppingCart className="mr-2" />
                            {t('title')} ({itemCount})
                        </h2>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <span className="sr-only">{t('close')}</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        {cart.items.length === 0 ? (
                            <div className="text-center py-12">
                                <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('emptyCart')}</h3>
                                <p className="mt-1 text-sm text-gray-500">{t('startShopping')}</p>
                                <div className="mt-6">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        onClick={onClose}
                                    >
                                        {t('continueShopping')}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-200">
                                    {cart.items.map((item) => (
                                        <li key={item.product.id} className="flex py-6">
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <Image
                                                    src={item.product.image || '/images/placeholder.jpg'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.product.name}</h3>
                                                        <p className="ml-4">€{(item.product.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                        {item.product.description}
                                                    </p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id!, item.quantity - 1)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <FaMinus size={12} />
                                                        </button>
                                                        <span className="text-gray-500">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <FaPlus size={12} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.product.id!)}
                                                        className="font-medium text-red-600 hover:text-red-500"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.items.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>{t('subtotal')}</p>
                                <p>€{cart.total.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">{t('shippingNote')}</p>
                            <div className="mt-6">
                                <Link
                                    href="/checkout"
                                    className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark"
                                    onClick={onClose}
                                >
                                    {t('checkout')}
                                </Link>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    {t('or')}{' '}
                                    <button
                                        type="button"
                                        className="font-medium text-primary hover:text-primary-dark"
                                        onClick={onClose}
                                    >
                                        {t('continueShopping')}
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;