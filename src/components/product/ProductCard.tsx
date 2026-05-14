import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { Heart, Star, Sparkles, ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";
import VirtualTrialModal from "./VirtualTrialModal";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isWishlisted(product.id);
  const [virtualTrialOpen, setVirtualTrialOpen] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  const handleVirtualTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVirtualTrialOpen(true);
  };

  return (
    <div className={cn("contents", className)}>
    <Link
      to={`/product/${product.id}`}
      className={cn("group relative bg-white rounded-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col")}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge className="text-[10px] py-0.5 px-1.5">NEW</Badge>}
          {product.isBestSeller && (
            <Badge variant="success" className="text-[10px] py-0.5 px-1.5">
              BESTSELLER
            </Badge>
          )}
          {product.discount >= 50 && (
            <Badge variant="secondary" className="text-[10px] py-0.5 px-1.5 bg-orange-100 text-orange-700">
              {product.discount}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            className={cn("transition-colors", wishlisted ? "fill-[#e31837] text-[#e31837]" : "text-gray-400")}
          />
        </button>

      </div>

      {/* Details */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-500 uppercase font-medium tracking-wider truncate">{product.brand}</p>
        <p className="text-sm text-gray-800 mt-0.5 line-clamp-2 flex-1">{product.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
            <span>{product.rating}</span>
            <Star size={10} className="fill-white" />
          </div>
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="text-xs text-[#e31837] font-semibold">({product.discount}% off)</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleQuickAdd}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            <ShoppingBag size={13} />
            Add to Bag
          </button>
          <button
            onClick={handleVirtualTrial}
            className="flex items-center justify-center gap-1 bg-gradient-to-r from-[#e31837] to-purple-600 hover:opacity-90 text-white text-xs font-semibold py-2 px-2.5 rounded-lg transition-opacity whitespace-nowrap"
          >
            <Sparkles size={12} />
            Try
          </button>
        </div>
      </div>
    </Link>

    {/* Virtual Trial Modal – portalled to document.body to escape grid/overflow */}
    {virtualTrialOpen && ReactDOM.createPortal(
      <VirtualTrialModal
        isOpen={virtualTrialOpen}
        onClose={() => setVirtualTrialOpen(false)}
        productName={product.name}
      />,
      document.body
    )}
    </div>
  );
};

export default ProductCard;
