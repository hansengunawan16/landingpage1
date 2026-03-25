'use client';

import { useCartStore } from "@/store/useCartStore";
import { createOrder, initiatePayment } from "@/services/api";
import { useState } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      // 1. Create Order
      const orderRes = await createOrder({
        cartId: 'c1102744-7c19-4cf6-bbee-fd8f02ee5524', // Use a stable ID for demo if needed, or get from session
        ...formData,
      });

      if (orderRes.success) {
        // 2. Initiate Payment
        const paymentRes = await initiatePayment(orderRes.data.order_id);
        if (paymentRes.success) {
          clearCart();
          window.location.href = paymentRes.data.payment_url;
        }
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Form Side */}
      <div className="flex-1 bg-white p-8 md:p-16">
        <div className="max-w-xl mx-auto">
          <Link href="/products" className="flex items-center text-sm font-bold text-gray-400 hover:text-black mb-12 group">
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            BACK TO SHOPPING
          </Link>

          <h1 className="font-display font-black text-4xl mb-12 tracking-tighter">CHECKOUT</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="font-display font-black text-sm tracking-widest mb-6">SHIPPING INFORMATION</h2>
              <div className="space-y-4">
                <input 
                  required
                  placeholder="Full Name"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:border-alpex-blue transition-colors"
                  value={formData.shippingName}
                  onChange={(e) => setFormData({...formData, shippingName: e.target.value})}
                />
                <input 
                  required
                  placeholder="Phone Number"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:border-alpex-blue transition-colors"
                  value={formData.shippingPhone}
                  onChange={(e) => setFormData({...formData, shippingPhone: e.target.value})}
                />
                <textarea 
                  required
                  placeholder="Complete Shipping Address"
                  rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:border-alpex-blue transition-colors"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                />
              </div>
            </section>

            <button 
              type="submit"
              disabled={loading || items.length === 0}
              className="btn-primary w-full flex items-center justify-center space-x-3 py-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={20} />
                  <span>COMPLETE & PAY NOW</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Summary Side */}
      <div className="w-full md:w-[45%] bg-gray-50 p-8 md:p-16 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-display font-black text-sm tracking-widest mb-10 text-gray-400">ORDER SUMMARY</h2>
          
          <div className="flex-1 space-y-6 mb-12 overflow-y-auto max-h-[400px] pr-4">
            {items.map((item) => (
              <div key={item.inventoryId} className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-200 rounded" />
                  <div>
                    <p className="font-display font-black text-xs uppercase">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">{item.sku}</p>
                    <p className="text-xs font-bold mt-1">QTY: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-display font-bold text-sm">IDR {(item.price * item.quantity).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-8 space-y-3">
            <div className="flex justify-between text-sm text-gray-500 font-bold">
              <span>Subtotal</span>
              <span>IDR {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-bold">
              <span>Estimated Shipping</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="flex justify-between pt-6 border-t mt-6">
              <span className="font-display font-black text-xl">TOTAL</span>
              <span className="font-display font-black text-3xl tracking-tighter">IDR {subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
