'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId: "your_paypal_client_id",
  currency: "EUR",
  intent: "capture"
};

export default function PayPalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
