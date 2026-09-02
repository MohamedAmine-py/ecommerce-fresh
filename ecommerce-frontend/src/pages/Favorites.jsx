import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { favorites } = useApp();

  return (
    <main className="favorites-page storefront-container">
      <header className="favorites-header">
        <div><span className="store-eyebrow">Votre sélection</span><h1>Saved Hardware</h1><p>Retrouvez le matériel que vous avez mis de côté.</p></div>
        <span className="result-count">{favorites.length} produit{favorites.length !== 1 ? "s" : ""}</span>
      </header>

      {favorites.length === 0 ? (
        <div className="favorites-empty store-state">
          <div className="wishlist-heart" aria-hidden="true">♡</div>
          <h3>Votre sélection est vide</h3>
          <p>Utilisez le cœur présent sur un produit pour le retrouver facilement ici.</p>
          <Link to="/products" className="button button-primary">Découvrir les produits</Link>
        </div>
      ) : (
        <div className="grid product-grid favorites-grid">
          {favorites.map((p, index) => (
            <ProductCard key={p.id} product={p} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
