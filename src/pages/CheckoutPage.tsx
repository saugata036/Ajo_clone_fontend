import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const steps = ["Address", "Payment", "Review"];

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const deliveryCharge = totalPrice >= 499 ? 0 : 49;
  const discount = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const finalPrice = totalPrice + deliveryCharge;

  const handlePlaceOrder = () => {
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => navigate("/"), 4000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 text-sm mb-4">
            Your order has been placed successfully. You'll receive a confirmation shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">Order Total: <strong>₹{finalPrice.toLocaleString()}</strong></p>
            <p className="text-sm text-gray-600 mt-1">Estimated Delivery: <strong>3-5 business days</strong></p>
          </div>
          <p className="text-xs text-gray-400 mb-4">Redirecting to home in a few seconds...</p>
          <Link to="/">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-2 cursor-pointer ${idx <= step ? "text-[#e31837]" : "text-gray-400"}`}
                onClick={() => idx < step && setStep(idx)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    idx < step
                      ? "bg-[#e31837] border-[#e31837] text-white"
                      : idx === step
                      ? "border-[#e31837] text-[#e31837]"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {idx < step ? "✓" : idx + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 max-w-20 ${idx < step ? "bg-[#e31837]" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main step content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 0: Address */}
              {step === 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin size={20} className="text-[#e31837]" />
                    <h2 className="font-bold text-gray-900">Delivery Address</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Full Name *</label>
                      <Input
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Mobile Number *</label>
                      <Input
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Pincode *</label>
                      <Input
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="6-digit pincode"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">City *</label>
                      <Input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 block mb-1">Address *</label>
                      <textarea
                        className="w-full border border-input rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        placeholder="House no., Street, Area, Landmark"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">State *</label>
                      <Input
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <Button className="mt-6 w-full sm:w-auto px-10" onClick={() => setStep(1)}>
                    Continue to Payment <ChevronRight size={16} />
                  </Button>
                </div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard size={20} className="text-[#e31837]" />
                    <h2 className="font-bold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "upi", label: "UPI / Google Pay / PhonePe", icon: "📱" },
                      { id: "card", label: "Credit / Debit Card", icon: "💳" },
                      { id: "netbanking", label: "Net Banking", icon: "🏦" },
                      { id: "cod", label: "Cash on Delivery", icon: "💵" },
                      { id: "emi", label: "EMI (No Cost EMI Available)", icon: "📅" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method.id ? "border-[#e31837] bg-red-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="accent-[#e31837]"
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="border-gray-300" onClick={() => setStep(0)}>
                      Back
                    </Button>
                    <Button className="flex-1 sm:flex-none sm:px-10" onClick={() => setStep(2)}>
                      Review Order <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div>
                  <h2 className="font-bold text-gray-900 mb-5">Review Your Order</h2>

                  {/* Address summary */}
                  <div className="mb-5 p-4 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-[#e31837]" />
                      <span className="font-semibold">Delivery Address</span>
                    </div>
                    <p className="text-gray-700">{address.name} • {address.phone}</p>
                    <p className="text-gray-600 mt-0.5">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                          <p className="text-sm font-bold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="border-gray-300" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="flex-1 sm:flex-none sm:px-10 font-bold" onClick={handlePlaceOrder}>
                      PLACE ORDER ₹{finalPrice.toLocaleString()}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Price Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">MRP Total</span>
                  <span>₹{items.reduce((s, i) => s + i.originalPrice * i.quantity, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{finalPrice.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                You save ₹{discount.toLocaleString()} on this order 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
