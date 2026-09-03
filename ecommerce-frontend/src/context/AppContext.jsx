import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { logout as apiLogout } from "../api/client";

const AppContext = createContext();

const favoriteStorageKey = (user) => user?.id
  ? `elite-pc:favorites:user:${user.id}`
  : "elite-pc:favorites:guest";

const readFavorites = (user) => {
  try {
    const stored = JSON.parse(localStorage.getItem(favoriteStorageKey(user)) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [favorites, setFavorites] = useState(() => {
    // The former global key could contain another account's data, so it is
    // intentionally discarded instead of being assigned or merged.
    localStorage.removeItem("favorites");
    return readFavorites(user);
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastSequence = useRef(0);
  const toastTimers = useRef(new Map());

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toast = useCallback((msg, type = "success") => {
    const id = `${Date.now()}-${++toastSequence.current}`;
    setToasts((t) => [...t, { id, msg, type }]);
    const timer = window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      toastTimers.current.delete(id);
    }, 3500);
    toastTimers.current.set(id, timer);
  }, []);

  useEffect(() => () => {
    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    toastTimers.current.clear();
  }, []);

  const handleLogin = useCallback((userData, userToken) => {
    setFavorites(readFavorites(userData));
    setUser(userData); setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    toast(`Bienvenue, ${userData.nom} !`);
  }, [toast]);

  const handleLogout = useCallback(async () => {
    if (token) await apiLogout(token).catch(() => {});
    setFavorites(readFavorites(null));
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

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateCartItem = useCallback((id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, quantite: qty } : i);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]); localStorage.removeItem("cart");
  }, []);

  const toggleFavorite = useCallback((product) => {
    const exists = favorites.some((favorite) => favorite.id === product.id);
    const updated = exists
      ? favorites.filter((favorite) => favorite.id !== product.id)
      : [...favorites, product];

    setFavorites(updated);
    localStorage.setItem(favoriteStorageKey(user), JSON.stringify(updated));
    toast(exists ? "Retiré des favoris" : "Ajouté aux favoris", "success");
  }, [favorites, toast, user]);

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
