import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a2e] text-white mt-16">
      {/* Newsletter */}
      <div className="bg-[#e31837] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Subscribe to our Newsletter</h3>
              <p className="text-sm opacity-90 mt-1">Get exclusive offers, updates & style tips</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-md text-gray-900 text-sm flex-1 md:w-72 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-black transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold text-[#e31837] mb-3">AI Fashion House</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's leading fashion destination with over 5000+ brands and 500,000+ products.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#e31837] transition-colors text-sm">f</a>
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#e31837] transition-colors text-sm">in</a>
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#e31837] transition-colors text-sm">tw</a>
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#e31837] transition-colors text-sm">yt</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Men", "Women", "Kids", "Footwear", "Accessories", "Sports", "Beauty"].map((item) => (
                <li key={item}>
                  <Link to={`/products/${item.toLowerCase()}`} className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["FAQ", "Track Order", "Returns & Refunds", "Shipping Info", "Size Guide", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link to="#" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["About Us", "Careers", "Press", "Investors", "Sustainability", "Terms of Use", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link to="#" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#e31837] flex-shrink-0" />
                <span>1800-889-9991</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#e31837] flex-shrink-0" />
                <span>care@aifh.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#e31837] flex-shrink-0 mt-1" />
                <span>Reliance Industries Ltd, Mumbai, India</span>
              </li>
            </ul>

            {/* App download */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Download App</p>
              <div className="flex flex-col gap-2">
                <a href="#" className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-xs flex items-center gap-2 transition-colors">
                  <span>📱</span> App Store
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-xs flex items-center gap-2 transition-colors">
                  <span>🤖</span> Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© 2024 Reliance Retail Ltd. All rights reserved.</p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">💳 Visa</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">💳 Mastercard</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">💳 UPI</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">💳 Net Banking</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">💳 EMI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
