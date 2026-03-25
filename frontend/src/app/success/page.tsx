'use client';

import Navbar from "@/components/layout/Navbar";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <Navbar />
      
      <div className="max-w-md animate-in fade-in zoom-in duration-1000">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-display font-black text-5xl mb-4 tracking-tighter">
          ORDER PLACED<span className="text-alpex-blue">.</span>
        </h1>
        <p className="text-gray-500 font-medium mb-12 leading-relaxed">
          Your transaction was successful. We've sent the order confirmation and tracking details to your email. Your Alpex gear is on its way.
        </p>

        <div className="space-y-4">
          <Link href="/products" className="btn-primary w-full flex items-center justify-center space-x-3">
            <ShoppingBag size={20} />
            <span>CONTINUE SHOPPING</span>
          </Link>
          <Link href="/" className="btn-outline w-full block">
            BACK TO HOME
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t text-xs font-bold text-gray-400 tracking-widest uppercase italic">
          Welcome to the Alpex Collective
        </div>
      </div>
    </main>
  );
}
