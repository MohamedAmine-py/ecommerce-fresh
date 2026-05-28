import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getProducts, getCategories, login, register, createOrder, getOrders } from "../api/client";
import ProductModal, { getProductImage } from "../components/ProductModal";
import AdminDashboard from "../components/AdminDashboard";
import SupportChat from "../components/SupportChat";
import "../styles/main.css";

// SVG Icons
const IconHeartOutline = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconHeartFilled = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconHeartSmall = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 6}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconSun = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const IconMoon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

const CAT_COLORS = {
  "Gamer PCs": "#ef4444", "Workstations": "#3b82f6", "Components": "#8b5cf6",
  "Peripherals": "#f59e0b", "PC Accessories": "#10b981", default: "#06b6d4"
};
const getCatColor = (c) => CAT_COLORS[c?.nom] || CAT_COLORS.default;

export default function MainPage() {
  const { 
    user, token, cart, cartCount, cartTotal, addToCart, updateCartItem, removeFromCart, clearCart, 
    setCartOpen, setAuthOpen, toast, handleLogin, handleLogout, cartOpen, authOpen, toasts,
    darkMode, setDarkMode, favorites, toggleFavorite
  } = useApp();

  const [page, setPage] = useState("home");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ nom: "", email: "", mot_de_passe: "" });
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p.data || []);
      setCategories(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (page === "orders" && token) {
      setOrdersLoading(true);
      getOrders(token).then(d => { setOrders(Array.isArray(d) ? d : []); setOrdersLoading(false); });
    }
  }, [page, token]);

  const filtered = products.filter(p => {
    const ms = p.nom.toLowerCase().includes(search.toLowerCase());
    const mc = !activeCat || Number(p.categorie_id) === Number(activeCat);
    return ms && mc;
  });

  const renderProductCard = (p, index) => {
    const isOut = p.stock === 0;
    const img = p.image || getProductImage(p.nom);
    const isFav = favorites.some(f => f.id === p.id);
    
    return (
      <div key={p.id} className="card animate-item" style={{ animationDelay: `${index * 0.05}s` }} onClick={() => setSelectedProduct(p)}>
        <div className="card-img">
          <img src={img} alt={p.nom} onError={e => { e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop"; }} />
          {isOut && <div className="card-badge badge-out">Épuisé</div>}
          {!isOut && p.stock <= 5 && <div className="card-badge badge-limited">Stock limité</div>}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }}
            style={{
              position: "absolute", top: 12, left: 12, width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: isFav ? "var(--accent)" : "#94a3b8",
              transition: "all 0.2s"
            }}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isFav ? <IconHeartFilled /> : <IconHeartOutline />}
          </button>
        </div>
        <div className="card-body">
          <div className="card-cat" style={{ color: getCatColor(p.categorie) }}>{p.categorie?.nom || "Hardware"}</div>
          <div className="card-stars">{[1,2,3,4,5].map(s => <span key={s} style={{ color: "var(--accent)" }}>★</span>)}</div>
          <div className="card-name">{p.nom}</div>
          <div className="card-desc">{p.description || "High-performance PC hardware"}</div>
          
          {(p.processor || p.graphics_card || p.ram_details) && (
            <div className="spec-pills">
              {p.processor && <span className="spec-pill">{p.processor}</span>}
              {p.graphics_card && <span className="spec-pill">{p.graphics_card}</span>}
              {p.ram_details && <span className="spec-pill">{p.ram_details}</span>}
            </div>
          )}

          <div className="card-foot">
            <div>
              <div className="card-price">{parseFloat(p.prix).toFixed(2)} €</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: isOut ? "#ef4444" : p.stock <= 5 ? "#f59e0b" : "var(--text3)", marginTop: 3 }}>
                {isOut ? "Rupture de stock" : `${p.stock} en stock`}
              </div>
            </div>
            <button className="card-add" disabled={isOut} title={isOut ? "Épuisé" : "Ajouter au panier"}
              onClick={e => { e.stopPropagation(); addToCart(p); }}>
              <IconCart />
            </button>
          </div>
        </div>
      </div>
    );
  };

  async function handleAuth() {
    setAuthErr(""); setAuthLoading(true);
    const fn = authMode === "login" ? login : register;
    const data = await fn(authForm);
    setAuthLoading(false);
    if (data.token) { handleLogin(data.user, data.token); setAuthOpen(false); }
    else setAuthErr(data.errors ? Object.values(data.errors).flat().join(" ") : data.message || "Erreur");
  }

  async function handleCheckout() {
    if (!user) { setCartOpen(false); setAuthOpen(true); return; }
    setCheckoutLoading(true);
    const data = await createOrder({ items: cart.map(i => ({ produit_id: i.id, quantite: i.quantite })) }, token);
    setCheckoutLoading(false);
    if (data.id) { clearCart(); setCartOpen(false); toast(`Commande #${data.id} passée !`); setPage("orders"); }
    else toast(data.message || "Erreur", "error");
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>
          <span>NextLevel</span><span className="nav-logo-accent">PC</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Boutique</button>
          <button className={`nav-link ${page === "favorites" ? "active" : ""}`} onClick={() => setPage("favorites")} style={{ display: "flex", alignItems: "center" }}>Favoris <IconHeartSmall /></button>
          {user && <button className={`nav-link ${page === "orders" ? "active" : ""}`} onClick={() => setPage("orders")}>Commandes</button>}
          {user?.role === "admin" && <button className={`nav-link admin-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>Admin</button>}
        </div>
        <div className="nav-search">
          <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"/></svg>
          <input placeholder="Rechercher des produits..." value={search} onChange={e => { setSearch(e.target.value); setPage("home"); }} />
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Mode Clair" : "Mode Sombre"}>
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
          <button className="nav-icon-btn" onClick={() => setCartOpen(true)} title="Panier">
            <IconCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <div className="nav-user-btn" onClick={() => setAuthOpen(true)}>
            <div className="nav-avatar">{user ? user.nom[0].toUpperCase() : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}</div>
            <span className="nav-user-name">{user ? user.nom.split(" ")[0] : "Connexion"}</span>
          </div>
        </div>
      </nav>

      <div className="page">
        {page === "home" && (
          <>
            <div className="hero">
              <div className="hero-inner animate-item">
                <div className="hero-tag">New Components & Systems 2026</div>
                <h1 className="hero-title">Build Your <em>Dream Rig</em><br/>No Compromise</h1>
                <p className="hero-desc">Discover our selection of ultra-high-performance PC hardware. Maximize framerates, dominate workloads, and elevate your setup.</p>
                <button className="hero-cta" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                  Explorer les produits →
                </button>
              </div>
            </div>

            <div className="cats">
              <button className={`cat-chip ${activeCat === null ? "active" : ""}`} onClick={() => { setActiveCat(null); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
                Tous
              </button>
              {categories.map(c => (
                <button key={c.id} className={`cat-chip ${activeCat === c.id ? "active" : ""}`}
                  onClick={() => { setActiveCat(activeCat === c.id ? null : c.id); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
                  {c.nom}
                </button>
              ))}
            </div>

            <div id="products">
              <div className="section-hd">
                <div className="section-title">{activeCat ? categories.find(c => c.id === activeCat)?.nom : "Tous les produits"}</div>
                <div className="section-badge">{filtered.length} articles</div>
              </div>

              {loading ? (
                <div className="grid">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
                      <div className="skel" style={{ height: 220 }} />
                      <div style={{ padding: 20 }}>
                        <div className="skel" style={{ height: 11, width: "40%", marginBottom: 10 }} />
                        <div className="skel" style={{ height: 16, marginBottom: 10 }} />
                        <div className="skel" style={{ height: 12, width: "70%", marginBottom: 16 }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div className="skel" style={{ height: 18, width: 80 }} />
                          <div className="skel" style={{ height: 38, width: 38, borderRadius: 10 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon" style={{ opacity: 0.1 }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <h3>Aucun résultat</h3>
                  <p>Essayez un autre terme de recherche</p>
                </div>
              ) : (
                <div className="grid">
                  {filtered.map(renderProductCard)}
                </div>
              )}
            </div>
          </>
        )}

        {page === "favorites" && (
          <div style={{ paddingTop: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>Mes Favoris</h1>
            <p style={{ color: "var(--text2)", marginBottom: 36 }}>Vos produits sauvegardés pour plus tard</p>
            {favorites.length === 0 ? (
              <div className="empty">
                <div className="empty-icon" style={{ opacity: 0.1 }}>
                  <IconHeartOutline width={64} height={64} />
                </div>
                <h3>Aucun favori</h3>
                <p>Appuyez sur le cœur d'un produit pour l'ajouter à vos favoris.</p>
                <button className="empty-btn" onClick={() => setPage("home")}>Découvrir les produits</button>
              </div>
            ) : (
              <div className="grid">
                {favorites.map(renderProductCard)}
              </div>
            )}
          </div>
        )}

        {page === "orders" && (
          <div style={{ paddingTop: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>Mes commandes</h1>
            <p style={{ color: "var(--text2)", marginBottom: 36 }}>Suivez l'état de vos achats</p>
            {!user ? (
              <div className="empty">
                <div className="empty-icon" style={{ opacity: 0.1 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3>Connectez-vous</h3><p>Pour voir vos commandes</p><button className="empty-btn" onClick={() => setAuthOpen(true)}>Se connecter</button>
              </div>
            ) : ordersLoading ? (
              <div className="empty"><div className="empty-icon">...</div><h3>Chargement...</h3></div>
            ) : orders.length === 0 ? (
              <div className="empty">
                <div className="empty-icon" style={{ opacity: 0.1 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3>Aucune commande</h3><p>Vos commandes apparaîtront ici</p><button className="empty-btn" onClick={() => setPage("home")}>Découvrir les produits</button>
              </div>
            ) : orders.map(o => (
              <div key={o.id} className="order-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--bg3)" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, color: "var(--text)" }}>Commande #{o.id}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "JetBrains Mono,monospace" }}>{new Date(o.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span className={`s-pill s-${o.statut}`}>{o.statut === "en_cours" ? "En cours" : o.statut === "validee" ? "Validée" : "Annulée"}</span>
                    <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>{parseFloat(o.total).toFixed(2)} €</div>
                  </div>
                </div>
                <table><thead><tr><th>Produit</th><th>Qté</th><th>Prix</th><th style={{ textAlign: "right" }}>Sous-total</th></tr></thead>
                  <tbody>{o.details?.map(d => (
                    <tr key={d.id}>
                      <td style={{ color: "var(--text)", fontWeight: 600 }}>{d.produit?.nom || "—"}</td>
                      <td>×{d.quantite}</td>
                      <td style={{ fontFamily: "JetBrains Mono,monospace" }}>{parseFloat(d.prix_unitaire).toFixed(2)} €</td>
                      <td style={{ textAlign: "right", color: "var(--accent)", fontWeight: 700, fontFamily: "JetBrains Mono,monospace" }}>{(d.quantite * d.prix_unitaire).toFixed(2)} €</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {page === "admin" && user?.role === "admin" && (
          <div style={{ paddingTop: 40 }}>
            <AdminDashboard token={token} onToast={toast} />
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col"><h3>À propos</h3><a href="#">Qui sommes-nous</a><a href="#">Nos valeurs</a><a href="#">Carrières</a></div>
            <div className="footer-col"><h3>Support</h3><a href="#">Centre d'aide</a><a href="#">Retours & échanges</a><a href="#">Garantie</a></div>
            <div className="footer-col"><h3>Légal</h3><a href="#">Confidentialité</a><a href="#">CGV</a><a href="#">Cookies</a></div>
            <div className="footer-col"><h3>Contact</h3><a href="mailto:support@nextlevelpc.com">support@nextlevelpc.com</a><a href="tel:+33123456789">+33 1 23 45 67 89</a></div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 Next Level PC. Tous droits réservés.</div>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Twitter</a>
              <a href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Instagram</a>
              <a href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} />
          <div className="drawer">
            <div className="drawer-hd">
              <div><div className="drawer-title">Mon Panier</div><div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{cartCount} article{cartCount !== 1 ? "s" : ""}</div></div>
              <button className="drawer-x" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="drawer-body">
              {cart.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon" style={{ opacity: 0.1 }}><IconCart width={64} height={64} /></div>
                  <h3>Panier vide</h3><p>Ajoutez des produits pour commencer</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-thumb"><img src={item.image || getProductImage(item.nom)} alt={item.nom} onError={e => { e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop"; }} /></div>
                  <div className="cart-info">
                    <div className="cart-name">{item.nom}</div>
                    <div className="cart-price">{(item.prix * item.quantite).toFixed(2)} €</div>
                    <div className="cart-ctrls">
                      <button className="qty-btn" onClick={() => updateCartItem(item.id, item.quantite - 1)}>−</button>
                      <span className="qty-n">{item.quantite}</span>
                      <button className="qty-btn" onClick={() => updateCartItem(item.id, item.quantite + 1)}>+</button>
                      <button className="del-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="drawer-ft">
                <div className="cart-total-row"><span className="cart-total-lbl">Total</span><span className="cart-total-val">{cartTotal.toFixed(2)} €</span></div>
                <button className="checkout-btn" onClick={handleCheckout} disabled={checkoutLoading}>
                  {checkoutLoading ? "Traitement..." : user ? "Confirmer la commande" : "Se connecter pour commander"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* AUTH MODAL */}
      {authOpen && (
        <div className="modal-ov" onClick={() => setAuthOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {user ? (
              <>
                <div className="modal-hd"><div className="modal-title">Mon compte</div><button className="modal-x" onClick={() => setAuthOpen(false)}>✕</button></div>
                <div className="modal-body">
                  <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#0f172a", margin: "0 auto 16px" }}>{user.nom[0].toUpperCase()}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>{user.nom}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>{user.email}</div>
                    {user.role === "admin" && <div style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 8 }}>Administrateur</div>}
                  </div>
                  <button onClick={() => { handleLogout(); setAuthOpen(false); }} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #fecaca", background: "#fee2e2", color: "#ef4444", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Déconnexion</button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-hd"><div className="modal-title">{authMode === "login" ? "Connexion" : "Inscription"}</div><button className="modal-x" onClick={() => setAuthOpen(false)}>✕</button></div>
                <div className="modal-body">
                  {authErr && <div className="err-msg">{authErr}</div>}
                  {authMode === "register" && (
                    <div className="f-group"><label className="f-label">Nom complet</label><input className="f-input" placeholder="Votre nom" value={authForm.nom} onChange={e => setAuthForm({...authForm, nom: e.target.value})} /></div>
                  )}
                  <div className="f-group"><label className="f-label">Email</label><input className="f-input" type="email" placeholder="vous@example.com" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} /></div>
                  <div className="f-group"><label className="f-label">Mot de passe</label><input className="f-input" type="password" placeholder="••••••••" value={authForm.mot_de_passe} onChange={e => setAuthForm({...authForm, mot_de_passe: e.target.value})} /></div>
                  <button className="submit-btn" onClick={handleAuth} disabled={authLoading}>{authLoading ? "Traitement..." : authMode === "login" ? "Se connecter" : "S'inscrire"}</button>
                  <div className="switch-mode">{authMode === "login" ? "Pas de compte ? " : "Déjà inscrit ? "}<span onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthErr(""); }}>{authMode === "login" ? "S'inscrire" : "Se connecter"}</span></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}

      {/* TOASTS */}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.type === "success" ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}</span>{t.msg}
          </div>
        ))}
      </div>

      {/* 24/7 AI Support Chat Agent */}
      <SupportChat />
    </>
  );
}
