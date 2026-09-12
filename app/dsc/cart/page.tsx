"use client";

// =============================================================================
// DSC Cart Page — /dsc/cart
// =============================================================================

import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Usb,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "@/lib/dsc/cart-context";
import { TOKEN_CONFIG } from "@/lib/dsc/config";

export default function CartPage() {
  const {
    items,
    tokenSelected,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    toggleToken,
    clearCart,
  } = useCart();

  const totalGst = items.reduce((sum, i) => sum + i.product.gstAmount * i.quantity, 0);
  const totalBasic = items.reduce((sum, i) => sum + i.product.basicAmount * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-16 px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Browse our Digital Signature Certificates and add the one you need to get started.
        </p>
        <Link
          href="/dsc"
          className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white text-sm font-bold rounded-xl hover:bg-navy-700 transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse DSC Products
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-6 md:pt-36 md:pb-8 bg-gray-50/50 border-b border-gray-200">
        <div className="container-tight px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900">Your Cart</h1>
              <p className="text-sm text-gray-500 mt-1">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="section-padding bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all"
                >
                  {/* Product Icon */}
                  <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-navy-600" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dsc/${item.product.slug}`}
                      className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full">
                        {item.product.certificateType}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {item.product.validityYears} {item.product.validityYears === 1 ? "Year" : "Years"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-navy-900">
                      ₹{item.product.grossAmount.toLocaleString("en-IN")}
                      <span className="text-[10px] text-gray-400 font-normal ml-1">incl. GST</span>
                    </div>
                  </div>

                  {/* Quantity + Actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-navy-900 bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-navy-900">
                        ₹{(item.product.grossAmount * item.quantity).toLocaleString("en-IN")}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="mt-1 flex items-center gap-1 text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* USB Token Add-on */}
              {TOKEN_CONFIG.enabled && (
                <div
                  onClick={toggleToken}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    tokenSelected
                      ? "border-gold-400 bg-gold-50/50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tokenSelected ? "bg-gold-100" : "bg-gray-100"
                  }`}>
                    <Usb className={`w-6 h-6 ${tokenSelected ? "text-gold-600" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-900">{TOKEN_CONFIG.name}</span>
                      {tokenSelected && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Added
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{TOKEN_CONFIG.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-bold text-navy-900">
                      ₹{TOKEN_CONFIG.price.toLocaleString("en-IN")}
                    </span>
                    <div className="mt-1">
                      <span className={`text-[10px] font-bold ${tokenSelected ? "text-gold-600" : "text-navy-600"}`}>
                        {tokenSelected ? "✓ Selected" : "Tap to Add"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue shopping */}
              <Link
                href="/dsc"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-800 font-medium transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-navy-900 mb-5">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs text-gray-700">
                      <span className="truncate pr-2">
                        {item.product.name} {item.quantity > 1 ? `(x${item.quantity})` : ""}
                      </span>
                      <span className="font-semibold flex-shrink-0">
                        ₹{(item.product.grossAmount * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}

                  {tokenSelected && (
                    <div className="flex justify-between text-xs text-gray-700">
                      <span>USB Crypto Token</span>
                      <span className="font-semibold">₹{TOKEN_CONFIG.price.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>

                {/* GST info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal (excl. GST)</span>
                    <span>₹{totalBasic.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>GST (18%)</span>
                    <span>₹{totalGst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  </div>
                  {tokenSelected && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Token</span>
                      <span>₹{TOKEN_CONFIG.price.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-sm font-bold text-navy-900">Total</span>
                  <span className="text-2xl font-black text-navy-900">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-[10px] text-gray-400 mb-4">
                  All prices in INR. Prices include 18% GST.
                </p>

                <Link
                  href="/dsc/checkout"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-navy-800 text-white text-sm font-bold rounded-xl hover:bg-navy-700 transition-all shadow-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust */}
                <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
                  {[
                    "CCA Approved Certificates",
                    "Secure Order Processing",
                    "Expert Support Included",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-500">
                      <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
