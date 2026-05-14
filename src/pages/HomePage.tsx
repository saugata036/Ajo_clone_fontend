import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Truck, RotateCcw, Shield, Tag } from "lucide-react";
import { products, categories, banners } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import { Button } from "../components/ui/Button";

const HomePage: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  const featuredProducts = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Marquee / Announcement */}
      <div className="bg-[#e31837] text-white py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-16">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <span className="text-xs font-medium">🔥 FLAT 50% OFF on 1000s of styles</span>
              <span className="text-xs font-medium">✨ NEW ARRIVALS every day</span>
              <span className="text-xs font-medium">🚚 FREE DELIVERY on orders above ₹499</span>
              <span className="text-xs font-medium">🎁 EXTRA 10% OFF on App orders</span>
              <span className="text-xs font-medium">⭐ 5000+ BRANDS to choose from</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden" style={{ height: "420px" }}>
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentBanner ? "opacity-100" : "opacity-0"}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-80 z-10`} />
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg">
                  <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-2">
                    AI Fashion House Week
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-white/90 text-lg mb-6">{banner.subtitle}</p>
                  <Link to={banner.link}>
                    <Button size="lg" className="bg-white text-[#e31837] hover:bg-gray-100 font-bold px-8">
                      {banner.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <button
          onClick={prevBanner}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBanner ? "bg-white w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
              { icon: RotateCcw, title: "Easy Returns", desc: "15-day return policy" },
              { icon: Shield, title: "Secure Payment", desc: "100% safe transactions" },
              { icon: Tag, title: "Best Prices", desc: "Guaranteed lowest prices" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="bg-[#e31837]/10 p-2.5 rounded-full">
                  <item.icon size={20} className="text-[#e31837]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Find your style across all categories</p>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products/${cat.id}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#e31837] transition-all">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-[#e31837] transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Men's Wear",
              subtitle: "Up to 60% off",
              bg: "bg-gradient-to-br from-blue-800 to-blue-500",
              link: "/products/men",
              img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=220&fit=crop",
            },
            {
              title: "Women's Fashion",
              subtitle: "Up to 70% off",
              bg: "bg-gradient-to-br from-pink-700 to-rose-400",
              link: "/products/women",
              img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=220&fit=crop",
            },
            {
              title: "Footwear Sale",
              subtitle: "Up to 50% off",
              bg: "bg-gradient-to-br from-amber-700 to-orange-400",
              link: "/products/footwear",
              img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=220&fit=crop",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="relative rounded-xl overflow-hidden group"
              style={{ height: "180px" }}
            >
              <div className={`absolute inset-0 ${item.bg} opacity-75`} />
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
                <p className="text-white/90 text-sm">{item.subtitle}</p>
                <span className="text-white text-xs mt-1 font-medium group-hover:underline">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🏆 Best Sellers</h2>
            <p className="text-gray-500 text-sm mt-1">Most loved by our customers</p>
          </div>
          <Link to="/products" className="text-[#e31837] text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">✨ New Arrivals</h2>
              <p className="text-gray-500 text-sm mt-1">Fresh styles, just dropped</p>
            </div>
            <Link to="/products?sort=newest" className="text-[#e31837] text-sm font-medium hover:underline">
              See All New
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Now</h2>
            <p className="text-gray-500 text-sm mt-1">What everyone is buying</p>
          </div>
          <Link to="/products" className="text-[#e31837] text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/products">
            <Button size="lg" variant="outline" className="px-12 border-[#e31837] text-[#e31837] hover:bg-[#e31837] hover:text-white">
              LOAD MORE PRODUCTS
            </Button>
          </Link>
        </div>
      </section>

      {/* Brand Banner */}
      <section className="bg-[#1a1a2e] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Top Brands You Love</h2>
          <p className="text-gray-400 text-sm mb-8">Shop from 5000+ premium brands</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Nike", "Adidas", "Levi's", "H&M", "Zara", "Puma", "Allen Solly", "Van Heusen"].map((brand) => (
              <div
                key={brand}
                className="bg-white rounded-lg px-6 py-3 font-bold text-gray-800 text-sm hover:bg-[#e31837] hover:text-white transition-colors cursor-pointer"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
