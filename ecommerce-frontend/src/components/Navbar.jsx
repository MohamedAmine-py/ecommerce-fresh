import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

// SVG Icons
const IconSun = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const IconMoon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconHeartOutline = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconHeartFilled = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;

export default function Navbar() {
  const { user, cartCount, darkMode, setDarkMode, setCartOpen, setAuthOpen, favorites, search, setSearch } = useApp();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    navigate("/products");
  };

  return (
    <nav className="nav">
      {/* BRAND LOGO REPLACED HERE */}
      <Link to="/" className="nav-logo" style={{ display: "flex", alignItems: "center" }}>
        <img 
          src="/pc_logo.png" 
          alt="Elite PC Logo" 
          style={{ height: "36px", width: "auto", objectContain: "contain" }} 
        />
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>Boutique</NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Produits</NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>À Propos</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Contact</NavLink>
        {user && <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Commandes</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin" className={({ isActive }) => `nav-link admin-btn ${isActive ? "active" : ""}`}>Admin</NavLink>}
      </div>
      <div className="nav-search">
        <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"/></svg>
        <input placeholder="Rechercher des produits..." value={search} onChange={handleSearchChange} />
      </div>
      <div className="nav-actions">
        <button className="nav-icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Mode Clair" : "Mode Sombre"}>
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>
        <NavLink to="/favorites" className={({ isActive }) => `nav-icon-btn ${isActive ? "active" : ""}`} title="Favoris" style={{ color: favorites.length > 0 ? "var(--accent)" : "rgba(255,255,255,.8)" }}>
          {favorites.length > 0 ? <IconHeartFilled /> : <IconHeartOutline />}
          {favorites.length > 0 && <span className="cart-badge" style={{ background: "var(--accent)" }}>{favorites.length}</span>}
        </NavLink>
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
  );
}