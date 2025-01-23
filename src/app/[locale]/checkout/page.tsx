'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/app/context/CartContext';
import OrdersService from '@/app/services/orders';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from '@/i18n/routing';

interface CheckoutForm {
  email: string;
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  paymentMethod: 'paypal' | 'card' | 'bank_transfer' | 'cash_on_delivery';
  shippingMethod: 'local' | 'international';
}

export default function Checkout() {
  const t = useTranslations();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    fullName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'paypal',
    shippingMethod: 'local',
  });

  const [orderSummary, setOrderSummary] = useState({
    subtotal: cart.total,
    shippingCost: 2,
    total: cart.total,
  });

  // Update shipping cost when shipping method or country changes
  const updateShippingCost = () => {
    const shippingCost = OrdersService.calculateShippingCost(
      formData.shippingMethod,
      formData.country
    );
    setOrderSummary({
      subtotal: cart.total,
      shippingCost,
      total: cart.total + shippingCost,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'shippingMethod' || name === 'country') {
      updateShippingCost();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderItems = cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

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

  if (cart.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
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
    <div className="container mx-auto px-4 py-20">
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
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t('checkout.city')}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder={t('checkout.country')}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
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
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <span>{t('checkout.creditCard')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <span>{t('checkout.bankTransfer')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <span>{t('checkout.cashOnDelivery')}</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}

            {formData.paymentMethod === 'paypal' ? (
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: orderSummary.total.toString(),
                          currency_code: 'EUR',
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  if (!actions.order) return;
                  
                  const details = await actions.order.capture();
                  try {
                    await handleSubmit(new Event('submit') as any);
                    // Additional PayPal success handling
                  } catch (err) {
                    console.error('PayPal payment error:', err);
                  }
                }}
              />
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading
                  ? t('checkout.processing')
                  : t('checkout.placeOrder')}
              </button>
            )}
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
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {t('checkout.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <span>€{(item.product.price * item.quantity)}</span>
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
