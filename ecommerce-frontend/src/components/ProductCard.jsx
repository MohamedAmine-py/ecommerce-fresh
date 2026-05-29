import React from "react";
import { useApp } from "../context/AppContext";
import { getProductImage } from "./ProductModal";

// SVG Icons
const IconHeartOutline = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconHeartFilled = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

const CAT_COLORS = {
  "Gamer PCs": "#ef4444", "Workstations": "#3b82f6", "Components": "#8b5cf6",
  "Peripherals": "#f59e0b", "PC Accessories": "#10b981", default: "#06b6d4"
};
const getCatColor = (c) => CAT_COLORS[c?.nom] || CAT_COLORS.default;

export default function ProductCard({ product, index, onSelect }) {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const p = product;
  const isOut = p.stock === 0;
  const img = p.image || getProductImage(p.nom);
  const isFav = favorites.some((f) => f.id === p.id);

  return (
    <div
      className="card animate-item"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onSelect(p)}
    >
      <div className="card-img">
        <img
          src={img}
          alt={p.nom}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop";
          }}
        />
        {isOut && <div className="card-badge badge-out">Épuisé</div>}
        {!isOut && p.stock <= 5 && (
          <div className="card-badge badge-limited">Stock limité</div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(p);
          }}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            color: isFav ? "var(--accent)" : "#94a3b8",
            transition: "all 0.2s",
          }}
          title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFav ? <IconHeartFilled /> : <IconHeartOutline />}
        </button>
      </div>
      <div className="card-body">
        <div className="card-cat" style={{ color: getCatColor(p.categorie) }}>
          {p.categorie?.nom || "Hardware"}
        </div>
        <div className="card-stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} style={{ color: "var(--accent)" }}>
              ★
            </span>
          ))}
        </div>
        <div className="card-name">{p.nom}</div>
        <div className="card-desc">
          {p.description || "High-performance PC hardware"}
        </div>

        {(p.processor || p.graphics_card || p.ram_details) && (
          <div className="spec-pills">
            {p.processor && <span className="spec-pill">{p.processor}</span>}
            {p.graphics_card && (
              <span className="spec-pill">{p.graphics_card}</span>
            )}
            {p.ram_details && <span className="spec-pill">{p.ram_details}</span>}
          </div>
        )}

        <div className="card-foot">
          <div>
            <div className="card-price">{parseFloat(p.prix).toFixed(2)} €</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isOut
                  ? "#ef4444"
                  : p.stock <= 5
                  ? "#f59e0b"
                  : "var(--text3)",
                marginTop: 3,
              }}
            >
              {isOut ? "Rupture de stock" : `${p.stock} en stock`}
            </div>
          </div>
          <button
            className="card-add"
            disabled={isOut}
            title={isOut ? "Épuisé" : "Ajouter au panier"}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(p);
            }}
          >
            <IconCart />
          </button>
        </div>
      </div>
    </div>
  );
}
