import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LojaKy",
  description: "Sua loja online completa! Venda pelo WhatsApp com catálogo digital, controle estoque e vendas em tempo real.",
  manifest: "/manifest.json",
  openGraph: {
    title: "LojaKy - Sua Loja Online Completa",
    description: "Venda pelo WhatsApp com catálogo digital. Controle estoque e vendas em tempo real. Sem taxas!",
    url: "https://lojaky.noviapp.com.br",
    siteName: "LojaKy",
    images: [
      {
        url: "https://lojaky.noviapp.com.br/logo-lojaky.png",
        width: 512,
        height: 512,
        alt: "LojaKy Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LojaKy - Sua Loja Online Completa",
    description: "Venda pelo WhatsApp com catálogo digital. Sem taxas!",
    images: ["https://lojaky.noviapp.com.br/logo-lojaky.png"],
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#a855f7",
};

import ThemeRegistry from "./components/ThemeRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
