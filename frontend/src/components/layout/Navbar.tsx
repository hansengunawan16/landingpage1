'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, toggleCart } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4",
      isScrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-100" : "bg-transparent"
    )}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="font-display font-black text-2xl tracking-tighter">
            ALPEX<span className="text-alpex-blue">.</span>
          </Link>
          <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black tracking-widest rounded-full animate-pulse">
            DEMO
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 font-display font-bold text-sm tracking-widest">
          <Link href="/products?category=men" className="hover:text-alpex-blue transition-colors">MEN</Link>
          <Link href="/products?category=women" className="hover:text-alpex-blue transition-colors">WOMEN</Link>
          <Link href="/products?category=shoes" className="hover:text-alpex-blue transition-colors">SHOES</Link>
          <Link href="/products?category=clothing" className="hover:text-alpex-blue transition-colors">CLOTHING</Link>
          <Link href="/products?category=accessories" className="hover:text-alpex-blue transition-colors">ACCESSORIES</Link>
        </div>

        {/* Search & Cart */}
        <div className="flex items-center space-x-5">
          <button className="hover:text-alpex-blue transition-colors">
            <Search size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => toggleCart(true)}
            className="relative hover:text-alpex-blue transition-colors"
          >
            <ShoppingBag size={22} strokeWidth={2.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-alpex-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in fade-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-8 flex flex-col space-y-6 font-display font-black text-2xl md:hidden">
          <Link href="/products?category=men" onClick={() => setIsMobileMenuOpen(false)}>MEN</Link>
          <Link href="/products?category=women" onClick={() => setIsMobileMenuOpen(false)}>WOMEN</Link>
          <Link href="/products?category=shoes" onClick={() => setIsMobileMenuOpen(false)}>SHOES</Link>
          <Link href="/products?category=clothing" onClick={() => setIsMobileMenuOpen(false)}>CLOTHING</Link>
          <Link href="/products?category=accessories" onClick={() => setIsMobileMenuOpen(false)}>ACCESSORIES</Link>
        </div>
      )}
    </nav>
  );
}
