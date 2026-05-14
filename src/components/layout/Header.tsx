import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { categories } from "../../data/products";
import { Input } from "../ui/Input";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1a1a2e] text-white text-xs py-1.5 text-center">
        <div className="flex items-center justify-center gap-6">
          <span>FREE DELIVERY on orders above ₹499</span>
          <span className="hidden md:block">|</span>
          <span className="hidden md:block">EASY RETURNS & EXCHANGE</span>
          <span className="hidden md:block">|</span>
          <span className="hidden md:block">100% SECURE PAYMENT</span>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#e31837]">AI Fashion House</span>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-10 text-sm bg-gray-50 border-gray-200 rounded-sm"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Account */}
              <Link
                to="/login"
                className="flex flex-col items-center p-2 hover:text-[#e31837] transition-colors text-sm hidden md:flex"
              >
                <User size={20} />
                <span className="text-xs mt-0.5">Account</span>
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex flex-col items-center p-2 hover:text-[#e31837] transition-colors relative"
              >
                <Heart size={20} />
                <span className="text-xs mt-0.5 hidden md:block">Wishlist</span>
                {wishlistTotal > 0 && (
                  <span className="absolute -top-0.5 right-0.5 bg-[#e31837] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {wishlistTotal}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex flex-col items-center p-2 hover:text-[#e31837] transition-colors relative"
              >
                <ShoppingBag size={20} />
                <span className="text-xs mt-0.5 hidden md:block">Bag</span>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 right-0.5 bg-[#e31837] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-gray-50"
              />
            </div>
          </form>
        </div>

        {/* Nav categories */}
        <nav className="hidden md:block border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-1">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={`/products/${cat.id}`}
                    className="flex items-center gap-1 px-3 py-3 text-sm font-medium hover:text-[#e31837] transition-colors whitespace-nowrap"
                  >
                    {cat.name}
                    <ChevronDown size={14} />
                  </Link>

                  {/* Dropdown */}
                  {activeCategory === cat.id && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border rounded-b-md min-w-[200px] z-50 py-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/products/${cat.id}?sub=${encodeURIComponent(sub)}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#e31837] transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link
                  to="/products?sale=true"
                  className="flex items-center px-3 py-3 text-sm font-bold text-[#e31837] hover:underline"
                >
                  SALE 🔥
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products/${cat.id}`}
                    className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-50 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products?sale=true"
                  className="flex items-center px-3 py-3 text-[#e31837] font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SALE 🔥
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
