"use client";

// =============================================================================
// Navbar — Responsive sticky navigation with mobile drawer
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ShoppingCart } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/lib/dsc/cart-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 ${
        scrolled ? "shadow-sm" : ""
      }`}
      id="navbar"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo variant={scrolled ? "dark" : "dark"} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-navy-800 bg-navy-50"
                      : "text-gray-600 hover:text-navy-800 hover:bg-gray-50"
                  }`}
                  id={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dsc/cart"
              className="relative p-2.5 rounded-lg text-gray-600 hover:text-navy-800 hover:bg-gray-50 transition-colors"
              aria-label={`DSC Shopping Cart (${cartCount} items)`}
              title="DSC Shopping Cart"
              id="nav-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-navy-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 text-white text-sm font-semibold rounded-lg hover:bg-navy-700 transition-all duration-300 shadow-md shadow-navy-800/20 hover:shadow-lg hover:shadow-navy-800/25 hover:-translate-y-0.5"
              id="nav-cta"
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Right Icons (Cart + Hamburger) */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/dsc/cart"
              className="relative p-2 rounded-lg text-gray-600 hover:text-navy-800 transition-colors"
              aria-label="DSC Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-navy-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-navy-800 hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        style={{ top: "64px" }}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl md:hidden transition-all duration-300 transform ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "text-navy-800 bg-navy-50"
                    : "text-gray-600 hover:text-navy-800 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/dsc/cart"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-navy-900 bg-gold-50/60 border border-gold-200/60"
          >
            <span className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="w-4 h-4 text-gold-600" />
              DSC Shopping Cart
            </span>
            <span className="bg-gold-500 text-navy-950 text-xs font-black px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </Link>

          <Link
            href="/dsc/track"
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-navy-800"
          >
            Track DSC Order Status →
          </Link>

          <div className="pt-3 pb-1">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-navy-800 text-white text-sm font-semibold rounded-xl hover:bg-navy-700 transition-colors"
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
