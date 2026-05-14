import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Star, Truck, RotateCcw, Shield, ChevronRight, Minus, Plus, Share2 } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/product/ProductCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😔</p>
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    const color = selectedColor || product.colors[0];
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, color);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    const color = selectedColor || product.colors[0];
    addToCart(product, selectedSize, color);
    navigate("/cart");
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const savings = product.originalPrice - product.price;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#e31837]">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/products/${product.category}`} className="hover:text-[#e31837] capitalize">
              {product.category}
            </Link>
            <ChevronRight size={12} />
            <Link to={`/products/${product.category}?sub=${product.subCategory}`} className="hover:text-[#e31837]">
              {product.subCategory}
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "w-16 h-20 rounded-md overflow-hidden border-2 transition-all",
                    selectedImage === idx ? "border-[#e31837]" : "border-transparent"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4" }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount >= 50 && (
                <div className="absolute top-3 left-3">
                  <Badge className="text-sm px-2 py-1">{product.discount}% OFF</Badge>
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-3 right-3">
                  <Badge variant="success">NEW</Badge>
                </div>
              )}
              <button
                onClick={handleWishlist}
                className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart
                  size={20}
                  className={cn(wishlisted ? "fill-[#e31837] text-[#e31837]" : "text-gray-400")}
                />
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">{product.brand}</p>
                  <h1 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h1>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Share2 size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-green-600 text-white text-sm px-2 py-0.5 rounded font-medium">
                  {product.rating} <Star size={12} className="fill-white" />
                </div>
                <span className="text-sm text-gray-500">
                  {product.reviews.toLocaleString()} Ratings & {Math.floor(product.reviews / 4).toLocaleString()} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 pb-4 border-b">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-lg text-gray-400 line-through mb-0.5">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-lg text-[#e31837] font-bold mb-0.5">({product.discount}% OFF)</span>
                </div>
                <p className="text-green-600 text-sm font-medium mt-1">
                  You save: ₹{savings.toLocaleString()} 🎉
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Inclusive of all taxes. Free delivery on this order</p>
              </div>

              {/* Colors */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    COLOR: <span className="text-gray-900">{selectedColor || product.colors[0]}</span>
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-3 py-1.5 text-xs border rounded-full transition-all",
                        (selectedColor === color || (!selectedColor && color === product.colors[0]))
                          ? "border-[#e31837] bg-[#e31837]/5 text-[#e31837] font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    SIZE: <span className={cn(selectedSize ? "text-gray-900" : "text-gray-400")}>
                      {selectedSize || "Select Size"}
                    </span>
                  </p>
                  <button className="text-xs text-[#e31837] font-medium hover:underline">Size Guide</button>
                </div>
                {sizeError && (
                  <p className="text-xs text-red-500 mt-1">Please select a size to continue</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={cn(
                        "min-w-[44px] h-10 px-3 text-sm border rounded-md transition-all font-medium",
                        selectedSize === size
                          ? "border-[#e31837] bg-[#e31837] text-white"
                          : "border-gray-200 text-gray-700 hover:border-[#e31837]"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">QUANTITY:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "flex-1 border-[#e31837] text-[#e31837] hover:bg-[#e31837] hover:text-white font-bold",
                    addedToCart && "bg-green-50 border-green-500 text-green-700 hover:bg-green-50 hover:text-green-700"
                  )}
                >
                  {addedToCart ? "✓ ADDED TO BAG" : "ADD TO BAG"}
                </Button>
                <Button onClick={handleBuyNow} size="lg" className="flex-1 font-bold">
                  BUY NOW
                </Button>
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:border-[#e31837] hover:text-[#e31837] transition-colors"
              >
                <Heart
                  size={16}
                  className={cn(wishlisted ? "fill-[#e31837] text-[#e31837]" : "")}
                />
                {wishlisted ? "WISHLISTED" : "WISHLIST"}
              </button>

              {/* Delivery info */}
              <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Truck size={20} className="text-[#e31837]" />
                    <span className="text-xs text-gray-600">Free Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <RotateCcw size={20} className="text-[#e31837]" />
                    <span className="text-xs text-gray-600">15-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Shield size={20} className="text-[#e31837]" />
                    <span className="text-xs text-gray-600">100% Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-lg p-5 shadow-sm mt-4">
              <h3 className="font-bold text-gray-900 mb-3">Product Details</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Category", value: product.subCategory },
                  { label: "Available Colors", value: product.colors.join(", ") },
                  { label: "Available Sizes", value: product.sizes.join(", ") },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className="text-sm text-gray-700 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
              <Link to={`/products/${product.category}`} className="text-[#e31837] text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
