import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (productId: number) => {
    const product = items.find((p) => p.id === productId);
    if (product) {
      addToCart(product, product.sizes[0], product.colors[0]);
      removeFromWishlist(productId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <Heart size={80} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty!</h2>
          <p className="text-gray-500 mb-8">Save items you love to your wishlist and come back to them later</p>
          <Link to="/products">
            <Button size="lg" className="px-12">
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-0.5">{items.length} saved item{items.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((product) => (
            <div key={product.id} className="bg-white rounded-md overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="relative aspect-[3/4]">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>

              <div className="p-3">
                <p className="text-xs text-gray-500 uppercase font-medium">{product.brand}</p>
                <Link to={`/product/${product.id}`}>
                  <p className="text-sm text-gray-800 mt-0.5 line-clamp-2 hover:text-[#e31837]">{product.name}</p>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-[#e31837] font-medium">{product.discount}% off</p>

                <button
                  onClick={() => handleMoveToCart(product.id)}
                  className="flex items-center justify-center gap-1.5 w-full mt-3 py-2 border border-[#e31837] text-[#e31837] rounded text-xs font-semibold hover:bg-[#e31837] hover:text-white transition-colors"
                >
                  <ShoppingBag size={13} />
                  MOVE TO BAG
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
