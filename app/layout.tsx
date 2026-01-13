import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OlinShop",
  description: "O seu shopping no WhatsApp.",
  manifest: "/manifest.json",
  icons: {
    icon: 'https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/iWSJGep.png',
    apple: 'https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/iWSJGep.png',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1D1D1F",
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
