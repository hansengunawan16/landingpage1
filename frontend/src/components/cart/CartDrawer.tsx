'use client';

import { useCartStore } from "@/store/useCartStore";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag size={24} strokeWidth={2.5} />
                <h2 className="font-display font-black text-2xl tracking-tighter">BAG ({items.length})</h2>
              </div>
              <button 
                onClick={() => toggleCart(false)}
                className="hover:scale-110 transition-transform p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={64} strokeWidth={1} className="text-gray-200 mb-6" />
                  <p className="font-display font-black text-xl mb-6">YOUR BAG IS EMPTY</p>
                  <Link 
                    href="/products" 
                    onClick={() => toggleCart(false)}
                    className="btn-outline text-xs tracking-widest"
                  >
                    CONTINUE SHOPPING
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.inventoryId} className="flex gap-4">
                    <div className="w-24 h-32 bg-muted rounded-md shrink-0 bg-gray-100" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-display font-black text-sm uppercase tracking-tight">{item.name}</h3>
                        <button onClick={() => removeItem(item.inventoryId)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-gray-400 text-xs font-bold mb-4 italic uppercase">{item.sku}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 border">
                          <button 
                            onClick={() => updateQuantity(item.inventoryId, Math.max(1, item.quantity - 1))}
                            className="hover:text-alpex-blue"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.inventoryId, item.quantity + 1)}
                            className="hover:text-alpex-blue"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-display font-bold text-sm">
                          IDR {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">SUBTOTAL</p>
                    <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
                  </div>
                  <p className="font-display font-black text-3xl tracking-tighter self-start">
                    IDR {subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
                <Link 
                  href="/checkout" 
                  onClick={() => toggleCart(false)}
                  className="btn-primary w-full flex items-center justify-center group"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <X size={20} className="ml-2 rotate-45 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
