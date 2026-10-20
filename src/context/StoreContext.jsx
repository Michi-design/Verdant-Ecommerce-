import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "../data/config.js";

const StoreContext = createContext(null);
const validIds = new Set(products.map((product) => product.id));

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStored("verdant-cart", [])
    .filter((line) => line && validIds.has(line.productId) && Number.isFinite(Number(line.quantity)) && Number(line.quantity) > 0)
    .map((line) => ({
      key: `${line.productId}:${typeof line.variant === "string" ? line.variant : ""}`,
      productId: line.productId,
      quantity: Math.floor(Number(line.quantity)),
      variant: typeof line.variant === "string" ? line.variant : "",
    }))
    .filter((line) => line.quantity > 0));
  const [wishlist, setWishlist] = useState(() => [...new Set(readStored("verdant-wishlist", []).filter((id) => validIds.has(id)))]);

  useEffect(() => {
    try { localStorage.setItem("verdant-cart", JSON.stringify(cart)); }
    catch (error) { console.warn("Cart changes are only available for this session.", error); }
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem("verdant-wishlist", JSON.stringify(wishlist)); }
    catch (error) { console.warn("Wishlist changes are only available for this session.", error); }
  }, [wishlist]);

  const value = useMemo(() => {
    const addToCart = (product, quantity = 1, variant = "") => {
      if (!product || !validIds.has(product.id) || product.stockStatus !== "in-stock") return;
      const count = Math.min(99, Math.max(1, Math.floor(Number(quantity) || 1)));
      const key = `${product.id}:${variant}`;
      setCart((current) => {
        const existing = current.find((line) => line.key === key);
        if (existing) return current.map((line) => line.key === key
          ? { ...line, quantity: Math.min(99, line.quantity + count) }
          : line);
        return [...current, { key, productId: product.id, quantity: count, variant }];
      });
    };
    const changeQuantity = (key, quantity) => {
      setCart((current) => current.map((line) => line.key === key
        ? { ...line, quantity: Math.min(99, Math.max(1, Math.floor(Number(quantity) || 1))) }
        : line));
    };
    const removeFromCart = (key) => setCart((current) => current.filter((line) => line.key !== key));
    const toggleWishlist = (productId) => {
      if (!validIds.has(productId)) return;
      setWishlist((current) => current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]);
    };
    return { cart, wishlist, addToCart, changeQuantity, removeFromCart, toggleWishlist };
  }, [cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
