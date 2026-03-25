import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Alpex Style Co. | Premium Look, Accessible Price",
  description: "Experience premium fashion with Alpex. Bold designs for the modern generation.",
};

import Providers from "@/providers/Providers";
import CartDrawer from "@/components/cart/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable, 
        outfit.variable, 
        "font-body bg-white text-alpex-black antialiased"
      )}>
        <Providers>
          <CartDrawer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
