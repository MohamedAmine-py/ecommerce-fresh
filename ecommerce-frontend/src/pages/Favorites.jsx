import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { favorites, setSelectedProduct } = useApp();

  return (
    <div style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>
        Mes Favoris
      </h1>
      <p style={{ color: "var(--text2)", marginBottom: 36 }}>
        Vos produits sauvegardés pour plus tard.
      </p>

      {favorites.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" style={{ opacity: 0.1, fontSize: 64 }}>
            ❤️
          </div>
          <h3>Aucun favori</h3>
          <p>Appuyez sur le cœur d'un produit pour l'ajouter à vos favoris.</p>
          <Link to="/products" className="empty-btn" style={{ textDecoration: "none" }}>
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((p, index) => (
            <ProductCard
              key={p.id}
              product={p}
              index={index}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
