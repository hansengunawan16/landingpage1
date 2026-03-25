import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Featured Section */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h3 className="font-display font-black text-4xl md:text-6xl tracking-tighter mb-4">
              THE ESSENTIALS<span className="text-alpex-blue">.</span>
            </h3>
            <p className="text-gray-500 font-medium">
              Curated pieces designed for daily motion. Built to last, styled to lead.
            </p>
          </div>
          <Link href="/products" className="font-display font-bold border-b-2 border-alpex-black pb-1 hover:text-alpex-blue hover:border-alpex-blue transition-all">
            VIEW ALL PRODUCTS
          </Link>
        </div>

        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gray-200 animate-pulse group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-display font-black text-lg">ALPEX CORE SERIES 0{i}</h4>
              <p className="text-gray-500 text-sm mb-2">Shoes / Streetwear</p>
              <p className="font-display font-bold text-xl">IDR 1.250.000</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Message Section */}
      <section className="bg-alpex-black text-alpex-white py-32 text-center overflow-hidden relative">
        <div className="relative z-10 px-6">
          <h2 className="font-display font-black text-4xl md:text-7xl tracking-tighter mb-8 leading-none">
            PREMIUM LOOK.<br />
            <span className="text-alpex-blue/80">ACCESSIBLE PRICE.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
            Why settle for mass-market mediocrity or over-priced exclusivity? 
            Alpex delivers the bridge between luxury design and everyday accessibility.
          </p>
        </div>
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none whitespace-nowrap font-black text-[20vw] leading-none">
          ALPEX STYLE CO.
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
