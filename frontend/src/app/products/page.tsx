import Navbar from "@/components/layout/Navbar";
import { getProducts } from "@/services/api";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const productsResponse = await getProducts(searchParams);
  const products = Array.isArray(productsResponse) ? productsResponse : (productsResponse?.data || []);

  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter uppercase italic">
            {searchParams.category ?? 'EVERYTHING'}
          </h1>
          <div className="flex items-center space-x-4 font-display font-bold text-sm tracking-widest text-gray-500 overflow-x-auto pb-2 w-full md:w-auto">
            <Link href="/products" className="hover:text-black">ALL</Link>
            <Link href="/products?category=shoes" className="hover:text-black">SHOES</Link>
            <Link href="/products?category=clothing" className="hover:text-black">CLOTHING</Link>
            <Link href="/products?category=accessories" className="hover:text-black">ACCESSORIES</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product: any) => (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="aspect-[3/4] bg-muted rounded-md mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-100 group-hover:scale-105 transition-transform duration-700" />
                {product.brand && (
                  <span className="absolute top-4 left-4 font-display font-black text-xs bg-white px-2 py-1 tracking-widest">
                    {product.brand.toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-display font-black text-sm md:text-md group-hover:text-alpex-blue transition-colors">
                {product.name.toUpperCase()}
              </h3>
              <p className="text-gray-400 text-xs font-medium mb-1">{product.category.name}</p>
              <p className="font-display font-bold">IDR {Number(product.base_price).toLocaleString('id-ID')}</p>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-32 text-center">
            <h2 className="font-display font-black text-3xl opacity-20">NO PRODUCTS FOUND</h2>
          </div>
        )}
      </div>
    </main>
  );
}
