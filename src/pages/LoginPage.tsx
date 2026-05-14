import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/signup
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/">
              <span className="text-3xl font-bold text-[#e31837]">AI Fashion House</span>
            </Link>
            <p className="text-gray-500 text-sm mt-1">India's Fashion Destination</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                isLogin ? "border-[#e31837] text-[#e31837]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                !isLogin ? "border-[#e31837] text-[#e31837]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Mobile Number</label>
                <Input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <Link to="#" className="text-sm text-[#e31837] hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full font-bold mt-2">
              {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-white px-3">or continue with</span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
              <span className="text-lg">G</span>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
              <span className="text-lg">f</span>
              Facebook
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-5">
            By continuing, you agree to AI Fashion House's{" "}
            <Link to="#" className="text-[#e31837] hover:underline">Terms of Use</Link> &{" "}
            <Link to="#" className="text-[#e31837] hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
