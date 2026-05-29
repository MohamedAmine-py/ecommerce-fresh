import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { logout as apiLogout } from "../api/client";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites") || "[]"));
  
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true; // Default to dark mode
  });

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const handleLogin = useCallback((userData, userToken) => {
    setUser(userData); setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    toast(`Bienvenue, ${userData.nom} !`);
  }, [toast]);

  const handleLogout = useCallback(async () => {
    if (token) await apiLogout(token).catch(() => {});
    setUser(null); setToken(null);
    localStorage.removeItem("user"); localStorage.removeItem("token");
    toast("Déconnecté avec succès");
  }, [token, toast]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const updated = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantite: i.quantite + 1 } : i)
        : [...prev, { ...product, quantite: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
    toast(`${product.nom} ajouté au panier`);
  }, [toast]);

  const updateCartItem = useCallback((id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, quantite: qty } : i);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]); localStorage.removeItem("cart");
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((prev) => {
      const exists = prev.find(p => p.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter(p => p.id !== product.id);
        toast("Retiré des favoris", "success");
      } else {
        updated = [...prev, product];
        toast("Ajouté aux favoris", "success");
      }
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }, [toast]);

  const cartCount = cart.reduce((s, i) => s + i.quantite, 0);
  const cartTotal = cart.reduce((s, i) => s + i.prix * i.quantite, 0);

  return (
    <AppContext.Provider value={{
      user, token, cart, cartCount, cartTotal,
      cartOpen, setCartOpen, authOpen, setAuthOpen, toasts, toast,
      handleLogin, handleLogout,
      addToCart, updateCartItem, removeFromCart, clearCart,
      darkMode, setDarkMode, favorites, toggleFavorite,
      search, setSearch, selectedProduct, setSelectedProduct
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
