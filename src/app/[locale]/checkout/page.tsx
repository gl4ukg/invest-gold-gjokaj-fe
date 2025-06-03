'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePriceOfGram } from '@/app/hooks/usePriceOfGram';
import { useCart } from '@/app/context/CartContext';
import OrdersService from '@/app/services/orders';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from '@/i18n/routing';
import Loader from '@/app/components/Loader';
import { countries, kosovoMunicipalities } from '@/app/data/locations';
import Image from 'next/image';
import PaymentsService from '@/app/services/paymets';

interface CheckoutForm {
  email: string;
  fullName: string;
  address: string;
  city: string;
  country: string; // We'll store just the country value here
  postalCode: string;
  phone: string;
  paymentMethod: '' | 'paypal' | 'card' | 'cash_on_delivery';
  shippingMethod: 'local' | 'international';
}

export default function Checkout() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale()
  const { currentPrice } = usePriceOfGram();
  const { cart, clearCart, isLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    fullName: '',
    address: '',
    city: 'Prishtina',  // Default city for Kosovo
    country: 'XK',   // Default to Kosovo
    postalCode: '',
    phone: '',
    paymentMethod: '',
    shippingMethod: 'local',
  });
  console.log(currentPrice,"currentPrice")

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
    if (formData.country.toLowerCase() === 'xk') {
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
    if(formData.paymentMethod !== '') {

      setLoading(true);
      setError(null);
  
      try {
        const orderItems = cart.items.map((item) => ({
          id: String(item.id),
          configuration: item?.configuration,
          product: item.product,
          price: Number(item?.configuration?.weight) * currentPrice,
          image: String(item.product.images?.[0]),
          
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
          subtotal: cart.total,
        });
  
        if (formData.paymentMethod === 'paypal') {
          // PayPal payment will be handled by PayPal buttons
          return;
        }

        if (formData.paymentMethod === 'card') {
          const cardPayment = await PaymentsService.initiateCardPayment({
            orderId: order.id,
            amount: order.total,
            currency: 'EUR',
            returnUrl: `${window.location.origin}/${locale}/order-confirmation`,
          });
        
          if(cardPayment.success) {
            clearCart();
          }
          window.location.href = cardPayment.redirectUrl;
          return;
        } else {
          router.push(`/order-confirmation/${order.id}`);
        }
  
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t('checkout.errorProcessingOrder')
        );
      } finally {
        setLoading(false);
      }
    } else {
      setError(t('checkout.choosePaymentMethod'));
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
                  {formData.country.toLowerCase() === 'xk' ? (
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
                      <option key={country.value} value={country.value}>
                        {country.label}
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
     

                <label
                  className={`relative block cursor-pointer transition-all duration-200`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paymentMethod', value: 'card' },
                      } as any)
                    }
                    className="absolute opacity-0"
                  />
                  <div
                    className={`flex min-h-[100px] items-center gap-4 border rounded-xl p-4 transition-all duration-200 ${formData.paymentMethod === 'card'
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                      <svg className="w-6 h-6 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-lg font-semibold text-darkGray">{t('checkout.creditCard')}</span>
                      <span className="text-xs text-gray-500">
                        {t('checkout.payWithCard')}
                      </span>
                    </div>
                    <div className={`w-6 h-6 shrink-0 rounded-full border-2 ${formData.paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-gray-300'} flex items-center justify-center`}>
                      {formData.paymentMethod === 'card' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </label>

                <label
                  className={`relative block cursor-pointer transition-all duration-200`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paymentMethod', value: 'cash_on_delivery' },
                      } as any)
                    }
                    className="absolute opacity-0"
                  />
                  <div
                    className={`flex min-h-[100px] items-center gap-4 border rounded-xl p-4 transition-all duration-200 ${formData.paymentMethod === 'cash_on_delivery'
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                      <svg className="w-6 h-6 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 9V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 9H4C2.89543 9 2 9.89543 2 11V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-lg font-semibold text-darkGray">{t('checkout.cashOnDelivery')}</span>
                      <span className="text-xs text-gray-500">
                        {t('checkout.payOnDelivery')}
                      </span>
                    </div>
                    <div className={`w-6 h-6 shrink-0 rounded-full border-2 ${formData.paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary' : 'border-gray-300'} flex items-center justify-center`}>
                      {formData.paymentMethod === 'cash_on_delivery' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </label>
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
              {cart.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className='flex items-center gap-3 justify-between w-full'>
                    <div className='flex items-center gap-3 '>
                      <Image
                        src={String(item?.product?.images?.[0])}
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
                    <span>€{(Number(item?.configuration?.weight) * currentPrice)}</span>
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
