import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";


const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invest Gold Gjokaj",
  description: "Invest Gold është një kompani moderne me një stil të frymëzuar nga koncepti i punës Gjermane me dinamikën për të krijuar diçka me pasion,ne jemi gjithmonë të afërt me ata që betohen në frontin e dashurisë, nga ata që e vlerësojnë stilin klasik dhe thjeshtësinë.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages();

  return (
    <html lang="sq">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
