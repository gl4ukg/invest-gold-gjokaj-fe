'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { Link } from '@/i18n/routing';
import { useStep } from '../context/StepContext';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    const t = useTranslations('cart');
    const { cart, removeFromCart, itemCount } = useCart();
    const { setCurrentStep } = useStep();
    if (!isOpen) return null;

    const removeProduct = (productId: string) => {
        removeFromCart(productId);
        setCurrentStep(1);
    };

    return (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
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
                        <h2 className="text-lg font-medium text-darkGray flex items-center">
                            <FaShoppingCart className="mr-2" />
                            {t('title')} ({itemCount})
                        </h2>
                        <button
                            type="button"
                            className="text-darkGray hover:text-darkGray"
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
                                <FaShoppingCart className="mx-auto h-12 w-12 text-darkGray" />
                                <h3 className="mt-2 text-sm font-medium text-darkGray">{t('emptyCart')}</h3>
                                <p className="mt-1 text-sm text-darkGray">{t('startShopping')}</p>
                                <div className="mt-6">
                                    <Link
                                        href="/unaza"
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
                                    {cart.items?.map((item) => (
                                        <li key={item.id} className="flex py-6">
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <Image
                                                    src={item.product.images?.[0] || '/images/placeholder.jpg'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-darkGray">
                                                        <h3>{item.product.name}</h3>
                                                        <p className="ml-4">{item.product.weight} gram</p>
                                                    </div>
                                                    {/* <p className="mt-1 text-sm text-darkGray line-clamp-2">
                                                        {item.product.description}
                                                    </p> */}
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProduct(item.id!)}
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
                            <div className="flex justify-between text-base font-medium text-darkGray">
                                <p>{t('subtotal')}</p>
                                <p>€{cart.total.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-darkGray">{t('shippingNote')}</p>
                            <div className="mt-6">
                                <Link
                                    href="/configurator"
                                    className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark"
                                    prefetch={true}
                                >
                                    {t('configurator')}
                                </Link>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-darkGray">
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