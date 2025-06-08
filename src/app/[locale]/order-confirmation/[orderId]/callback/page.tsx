'use client';
import { useEffect } from 'react';
import { useParams,  } from 'next/navigation';
import OrdersService from '@/app/services/orders';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function OrderCallback() {
  const router = useRouter();
  const params = useParams();
  const { clearCart } = useCart();
  const t = useTranslations();

  useEffect(() => {
    const confirmPayment = async () => {
      const orderId = params?.orderId as string;
  
      try {
        const order = await OrdersService.getOrder(orderId);
  
        if (order.paymentMethod === 'card' && order.paymentStatus === 'pending') {
          // If still pending, but redirect worked, assume success
          await OrdersService.markOrderAsPaid(orderId);
          clearCart();
        }
  
        router.push(`/order-confirmation/${orderId}`);
      } catch (error) {
        router.push(`/order-confirmation/error`);
      }
    };
  
    confirmPayment();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen text-darkGray">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">

                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    {t('orderConfirmation.verifyingPayment')}
                </h1>
            </div>
        </div>
    </div>
  )
}
