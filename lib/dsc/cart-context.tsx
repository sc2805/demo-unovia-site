"use client";

// =============================================================================
// DSC Store — Cart Context (Client-side state + localStorage persistence)
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getProductById, type DSCProduct } from "@/lib/dsc/products";
import { TOKEN_CONFIG, SUPPORT_CHARGE_CONFIG } from "@/lib/dsc/config";

export interface CartItem {
  productId: string;
  quantity: number;
  product: DSCProduct;
}

interface CartContextType {
  items: CartItem[];
  tokenSelected: boolean;
  cartCount: number;
  cartTotal: number;

  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleToken: () => void;
  setTokenSelected: (selected: boolean) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "unovia-dsc-cart";

interface StoredCart {
  items: { productId: string; quantity: number }[];
  tokenSelected: boolean;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tokenSelected, setTokenSelectedState] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: StoredCart = JSON.parse(stored);
        const hydratedItems: CartItem[] = [];
        for (const si of parsed.items) {
          const product = getProductById(si.productId);
          if (product && product.active) {
            hydratedItems.push({ productId: si.productId, quantity: si.quantity, product });
          }
        }
        setItems(hydratedItems);
        setTokenSelectedState(parsed.tokenSelected && TOKEN_CONFIG.enabled);
      }
    } catch {
      // ignore corrupted localStorage
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    const stored: StoredCart = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      tokenSelected,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
  }, [items, tokenSelected, isHydrated]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product || !product.active) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
            : i
        );
      }
      return [...prev, { productId, quantity: Math.min(quantity, 99), product }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, 99) } : i
      )
    );
  }, [removeFromCart]);

  const toggleToken = useCallback(() => {
    if (!TOKEN_CONFIG.enabled) return;
    setTokenSelectedState((prev) => !prev);
  }, []);

  const setTokenSelected = useCallback((selected: boolean) => {
    if (!TOKEN_CONFIG.enabled) return;
    setTokenSelectedState(selected);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setTokenSelectedState(false);
  }, []);

  const getItem = useCallback(
    (productId: string) => items.find((i) => i.productId === productId),
    [items]
  );

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const cartTotal =
    items.reduce((sum, i) => sum + i.product.grossAmount * i.quantity, 0) +
    (tokenSelected ? TOKEN_CONFIG.price : 0) +
    (SUPPORT_CHARGE_CONFIG.enabled ? SUPPORT_CHARGE_CONFIG.amount : 0);

  return (
    <CartContext.Provider
      value={{
        items,
        tokenSelected,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleToken,
        setTokenSelected,
        clearCart,
        getItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const defaultCartContext: CartContextType = {
  items: [],
  tokenSelected: false,
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  toggleToken: () => {},
  setTokenSelected: () => {},
  clearCart: () => {},
  getItem: () => undefined,
};

export function useCart() {
  const context = useContext(CartContext);
  return context || defaultCartContext;
}
