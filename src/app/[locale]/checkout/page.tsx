'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/app/context/CartContext';
import OrdersService from '@/app/services/orders';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from '@/i18n/routing';
import Loader from '@/app/components/Loader';
import { countries, kosovoMunicipalities } from '@/app/data/locations';
import Image from 'next/image';

interface CheckoutForm {
  email: string;
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  paymentMethod: 'paypal' | 'card' | 
  // 'bank_transfer' |
   'cash_on_delivery';
  shippingMethod: 'local' | 'international';
}

export default function Checkout() {
  const t = useTranslations();
  const router = useRouter();
  const { cart, clearCart, isLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    fullName: '',
    address: '',
    city: 'Prishtina',  // Default city for Kosovo
    country: 'Kosovo',   // Default to Kosovo
    postalCode: '',
    phone: '',
    paymentMethod: 'paypal',
    shippingMethod: 'local',
  });

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingCost: 2,
    total: 0,
  });

  // Initialize order summary with useEffect to ensure cart is loaded
  useEffect(() => {
    setOrderSummary({
      subtotal: cart.total,
      shippingCost: 2, // Default shipping cost
      total: cart.total + 2,
    });
  }, [cart.total]);

  useEffect(() => {
    if (formData.country.toLowerCase() === 'kosovo') {
      // If city is not in Kosovo municipalities, reset it
      if (!kosovoMunicipalities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: kosovoMunicipalities[0] }));
      } else {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    }
  }, [formData.country]);

  // Update shipping cost when shipping method or country changes
  const updateShippingCost = (shippingMethod: string, country: string) => {
    const shippingCost = OrdersService.calculateShippingCost(
      shippingMethod,
      country
    );
    console.log(shippingCost, "shipping cost");
    setOrderSummary({
      subtotal: cart.total,
      shippingCost,
      total: cart.total + shippingCost,
    });
  };
  console.log(formData, "form data");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'shippingMethod') {
      updateShippingCost(value, formData.country);
    } else if (name === 'country') {
      updateShippingCost(formData.shippingMethod, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderItems = cart.items?.map((item) => ({
        productId: String(item.product.id),
        quantity: item.quantity,
        price: Number(item.product.price),
      }));
      console.log(orderItems, "order items");

      const order = await OrdersService.createOrder({
        email: formData.email,
        items: orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
      });

      if (formData.paymentMethod === 'paypal') {
        // PayPal payment will be handled by PayPal buttons
        return;
      }

      // For other payment methods, redirect to confirmation
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('checkout.errorProcessingOrder')
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center h-screen mx-auto px-4 pt-32 pb-20">
        <Loader />
      </div>
    );
  }

  if (cart.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('checkout.emptyCart')}</h1>
          <button
            onClick={() => router.push('/shop')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            {t('checkout.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen text-darkGray">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t('checkout.contactInformation')}
              </h2>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('checkout.email')}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t('checkout.shippingAddress')}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('checkout.fullName')}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t('checkout.address')}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-4">
                  {formData.country.toLowerCase() === 'kosovo' ? (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      {kosovoMunicipalities?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={t('checkout.city')}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  )}
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    {countries?.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder={t('checkout.postalCode')}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('checkout.phone')}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t('checkout.shippingMethod')}
              </h2>
              <select
                name="shippingMethod"
                value={formData.shippingMethod}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="local">{t('checkout.localDelivery')}</option>
                <option value="international">
                  {t('checkout.internationalDelivery')}
                </option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t('checkout.paymentMethod')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() =>
                    handleInputChange({
                      target: { name: 'paymentMethod', value: 'card' },
                    } as any)
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => {}}
                      className="text-primary w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{t('checkout.creditCard')}</span>
                      <span className="text-sm text-gray-500">
                        {t('checkout.payWithCard')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'cash_on_delivery'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() =>
                    handleInputChange({
                      target: { name: 'paymentMethod', value: 'cash_on_delivery' },
                    } as any)
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={() => {}}
                      className="text-primary w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{t('checkout.cashOnDelivery')}</span>
                      <span className="text-sm text-gray-500">
                        {t('checkout.payOnDelivery')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading
                ? t('checkout.processing')
                : t('checkout.placeOrder')}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {t('checkout.orderSummary')}
            </h2>
            <div className="space-y-4">
              {cart.items?.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className='flex items-center gap-3 justify-between w-full'>
                    <div className='flex items-center gap-3 '>
                      <Image
                        src={String(item?.product?.image)}
                        alt={item?.product?.name}
                        width={50}
                        height={50}
                      />
                      <div className='flex flex-col'>
                        <h3 className="font-medium">{t('checkout.product')}: {item?.product?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {t('checkout.quantity')}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span>€{(Number(item.product.price) * item.quantity)}</span>
                  </div>
                </div>
              ))}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>{t('checkout.subtotal')}</span>
                  <span>€{orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('checkout.shipping')}</span>
                  <span>€{orderSummary.shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>{t('checkout.total')}</span>
                  <span>€{orderSummary.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
