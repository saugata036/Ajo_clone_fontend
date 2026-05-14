import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = totalPrice >= 499 ? 0 : 49;
  const discount = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const finalPrice = totalPrice + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <ShoppingBag size={80} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Bag is Empty!</h2>
          <p className="text-gray-500 mb-8">Add items to your bag and they'll appear here</p>
          <Link to="/products">
            <Button size="lg" className="px-12">
              Continue Shopping
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
            <h1 className="text-2xl font-bold text-gray-900">My Bag</h1>
            <p className="text-gray-500 text-sm mt-0.5">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="bg-white rounded-lg p-4 shadow-sm flex gap-4"
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-md flex-shrink-0 hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">{item.brand}</p>
                      <Link to={`/product/${item.id}`}>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5 hover:text-[#e31837] transition-colors">
                          {item.name}
                        </p>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
                      Size: <strong>{item.selectedSize}</strong>
                    </span>
                    <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
                      Color: <strong>{item.selectedColor}</strong>
                    </span>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                      <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 border-r"
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 border-l"
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-gray-400 line-through">
                        ₹{(item.originalPrice * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        {item.discount}% off
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Tag size={18} className="text-[#e31837]" />
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 text-sm outline-none placeholder:text-gray-400"
                />
                <Button size="sm" variant="outline" className="border-[#e31837] text-[#e31837]">
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-5 shadow-sm sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b">ORDER SUMMARY</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bag Total ({totalItems} items)</span>
                  <span className="font-medium">₹{items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount on MRP</span>
                  <span className="font-medium">- ₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
              </div>

              {deliveryCharge > 0 && (
                <div className="mt-3 bg-green-50 text-green-700 text-xs p-2.5 rounded-md">
                  Add ₹{(499 - totalPrice).toLocaleString()} more to get FREE delivery!
                </div>
              )}

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{finalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  You will save ₹{discount.toLocaleString()} on this order!
                </p>
              </div>

              <Button
                size="lg"
                className="w-full mt-5 font-bold"
                onClick={() => navigate("/checkout")}
              >
                PLACE ORDER
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">🔒 Safe and Secure Payments</p>
                <p className="text-xs text-gray-400 mt-1">Easy 15-day returns & exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
