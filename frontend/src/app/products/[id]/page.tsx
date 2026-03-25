'use client';

import Navbar from "@/components/layout/Navbar";
import { getProductBySlug } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingBag, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    getProductBySlug(id as string)
      .then((res) => {
        setProduct(res.data);
        if (res.data.inventory?.length > 0) {
          setSelectedInventory(res.data.inventory[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-display font-black text-4xl animate-pulse">ALPEX.</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  const handleAddToCart = () => {
    if (!selectedInventory) return;
    
    addItem({
      inventoryId: selectedInventory.id,
      sku: selectedInventory.sku,
      name: product.name,
      price: Number(product.base_price),
      quantity: 1,
    });
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      toggleCart(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen pt-24 pb-24">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery Placeholder */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-muted rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gray-100" />
            <span className="absolute top-6 left-6 font-display font-black text-sm bg-white px-3 py-1.5 tracking-widest border shadow-sm">
              PREMIUM SELECTION
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg border hover:border-black cursor-pointer transition-all" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter uppercase mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-display font-bold text-gray-400">
              IDR {Number(product.base_price).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="mb-10">
            <p className="text-gray-600 leading-relaxed mb-6 font-medium">
              {product.description || "The Alpex Core series represents our commitment to bold aesthetics and daily functionality. Engineered for the modern silhouette, this piece features premium materials and a precision-focused construction."}
            </p>
            <div className="flex items-center space-x-2 text-sm font-bold text-alpex-blue group cursor-pointer w-fit">
              <span>View technical specifications</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-black text-sm tracking-widest">SELECT SIZE</span>
              <span className="text-xs font-bold text-gray-400 underline cursor-pointer">Size Guide</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {product.inventory?.map((inv: any) => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInventory(inv)}
                  className={cn(
                    "py-4 rounded-md border-2 font-display font-bold text-sm transition-all",
                    selectedInventory?.id === inv.id 
                      ? "border-alpex-black bg-alpex-black text-white" 
                      : "border-gray-100 hover:border-gray-300 text-gray-500",
                    inv.stock_quantity === 0 && "opacity-30 cursor-not-allowed line-through"
                  )}
                  disabled={inv.stock_quantity === 0}
                >
                  {inv.size}
                  {inv.stock_quantity < 5 && inv.stock_quantity > 0 && (
                    <span className="block text-[8px] mt-1 opacity-70">LOW STOCK</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-4">
            <button 
              onClick={handleAddToCart}
              className={cn(
                "w-full py-6 rounded-full font-display font-black text-lg tracking-widest transition-all overflow-hidden flex items-center justify-center space-x-3",
                added ? "bg-green-500 text-white" : "bg-alpex-black text-alpex-white hover:bg-alpex-blue"
              )}
            >
              {added ? (
                <>
                  <Check size={24} strokeWidth={3} />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={24} strokeWidth={2.5} />
                  <span>ADD TO BAG</span>
                </>
              )}
            </button>
            <p className="text-center text-xs font-bold text-gray-400">
              Free Standard Shipping on all orders over IDR 2.000.000
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
