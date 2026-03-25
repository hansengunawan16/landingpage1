import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Visual Placeholder (Will be Next/Image) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="relative z-10 text-center text-white px-6">
        <h2 className="font-display font-black text-5xl md:text-8xl tracking-tight mb-4">
          EVOLVE YOUR <br /> 
          <span className="text-alpex-blue italic">STREET</span> LOGIC
        </h2>
        <p className="font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">
          Premium aesthetics. Engineered performance. Accessible price points.
          Welcome to the new standard of streetwear.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/products" className="btn-primary w-full md:w-auto">
            SHOP NEW COLLECTION
          </Link>
          <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-black w-full md:w-auto">
            OUR STORY
          </Link>
        </div>
      </div>
    </section>
  );
}
