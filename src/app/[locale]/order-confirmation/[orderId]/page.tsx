'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import OrdersService, { Order } from '@/app/services/orders';
import { useRouter } from '@/i18n/routing';
import Loader from '@/app/components/Loader';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function OrderConfirmation() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart(); 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = params.orderId as string;
        const orderData = await OrdersService.getOrder(orderId);
        setOrder(orderData);
        clearCart();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t('orderConfirmation.errorLoading')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId, t]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center h-screen mx-auto px-4 pt-32 pb-20">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container flex items-center justify-center h-screen mx-auto px-4 pt-32 pb-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {t('orderConfirmation.error')}
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/shop`)}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            {t('orderConfirmation.backToShop')}
          </button>
        </div>
      </div>
    );
  }


  const paymentMethod: { [key: string]: string } = {
    "paypal": "PayPal",
    "card": "Credit Card",
    "bank_transfer": t('orderConfirmation.paymentMethods.bank_transfer'),
    "cash_on_delivery": t('orderConfirmation.paymentMethods.cash_on_delivery'),
  }

  const shippingMethod: { [key: string]: string } = {
    "local": t('orderConfirmation.shippingMethods.local'),
    "international": t('orderConfirmation.shippingMethods.international'),
  }

  if(order?.paymentMethod === 'card' && order?.paymentStatus !== 'success' ) {
    return (

      <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen text-darkGray">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              {t('orderConfirmation.thankYou')}
            </h1>
            <p className="text-gray-600">
              {t('orderConfirmation.orderNumber')}: {order.id}
            </p>
          </div>

          <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md my-4">
            Payment was not successful. Your order is pending or failed. You can retry payment or contact support.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen text-darkGray">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            {t('orderConfirmation.thankYou')}
          </h1>
          <p className="text-gray-600">
            {t('orderConfirmation.orderNumber')}: {order.id}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('orderConfirmation.orderDetails')}
          </h2>

          {/* Order Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">{t('orderConfirmation.status')}</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {order.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">{t('orderConfirmation.items')}</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className='flex align-items-center'>
                    <Image src={String(item?.product?.images?.[0])} alt={String(item?.product?.name)} width={75} height={75} />
                    <div className='flex flex-col ms-3'>
                      <p className="font-medium">{t('orderConfirmation.productName')}: {item?.product?.name}</p>
                      <span>{t('orderConfirmation.price')}: €{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">
              {t('orderConfirmation.shippingAddress')}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="capitalize">{t('orderConfirmation.addressLabels.name')}: {order.shippingAddress.fullName}</p>
              <p className="capitalize">{t('orderConfirmation.addressLabels.address')}: {order.shippingAddress.address}</p>
              <p className="capitalize">
                {t('orderConfirmation.addressLabels.city')}: {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="capitalize">{t('orderConfirmation.addressLabels.country')}: {order.shippingAddress.country}</p>
              <p className="capitalize">{t('orderConfirmation.addressLabels.phone')}: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">
              {t('orderConfirmation.paymentInformation')}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                {t('orderConfirmation.method')}: {paymentMethod[order.paymentMethod]}
              </p>
              <p>
                {t('orderConfirmation.shipping')}: {shippingMethod[order.shippingMethod]}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-medium mb-3">
              {t('orderConfirmation.orderSummary')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('orderConfirmation.subtotal')}</span>
                <span>€{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('orderConfirmation.shipping')}</span>
                <span>€{order.shippingCost}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>{t('orderConfirmation.total')}</span>
                <span>€{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <button
            onClick={() => router.push('/shop')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            {t('orderConfirmation.continueShopping')}
          </button>
        </div>
      </div>
    </div>
  );
}
