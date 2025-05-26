'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { PackageX } from 'lucide-react';

export default function ErrorOrder() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-48">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <PackageX className="text-primary mx-auto" size={100} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-darkGray">
          {t('orderConfirmation.errorTitle')}
        </h1>
        <p className="text-darkGray mb-8">
          {t('orderConfirmation.errorMessage')}
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/checkout')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('orderConfirmation.tryAgain')}
          </button>
          <button
            onClick={() => router.push('/')}
            className="border border-darkGray text-darkGray px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('orderConfirmation.backToHome')}
          </button>
        </div>
        <p className="mt-8 text-sm text-darkGray">
          {t('orderConfirmation.errorSupport')}
        </p>
      </div>
    </div>
  );
}
