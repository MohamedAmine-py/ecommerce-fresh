import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/client";
import { useApp } from "../context/AppContext";
import { StorefrontState } from "../components/StorefrontUI";
import { applyProductFallback, productImage } from "../utils/productAssets";

const HeartIcon = ({ filled }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
);

export default function ProductDetails() {
  const { id } = useParams();
  const { favorites, toggleFavorite, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((requestError) => setError(requestError.status === 404 ? "Ce produit n’existe plus." : "Impossible de charger ce produit."))
      .finally(() => setLoading(false));
  }, [id]);

  const specs = useMemo(() => product ? [
    ["Marque", product.brand],
    ["Processeur", product.processor],
    ["Carte graphique", product.graphics_card],
    ["Mémoire", product.ram_details],
    ["Stockage", product.storage_details],
    ["Type", product.is_custom_build ? "Configuration assemblée" : null],
  ].filter(([, value]) => value) : [], [product]);

  if (loading) {
    return <main className="product-detail-page storefront-container"><div className="product-detail-skeleton"><div className="skel" /><div><div className="skel" /><div className="skel" /><div className="skel" /></div></div></main>;
  }

  if (error || !product) {
    return <main className="product-detail-page storefront-container"><StorefrontState title="Produit indisponible" message={error || "Ce produit n’est pas disponible."} actionLabel="Retour au catalogue" actionTo="/products" /></main>;
  }

  const isOut = product.stock === 0;
  const isFavorite = favorites.some((favorite) => favorite.id === product.id);

  return (
    <main className="product-detail-page storefront-container">
      <nav className="product-breadcrumb" aria-label="Fil d’Ariane"><Link to="/products">Catalogue</Link><span>/</span><span>{product.categorie?.nom || "Hardware"}</span></nav>
      <section className="product-detail-hero">
        <div className="product-detail-media">
          <img src={productImage(product)} alt={product.nom} decoding="async" onError={(event) => applyProductFallback(event, product)} />
          <span className={`detail-stock-badge ${isOut ? "is-out" : product.stock <= 5 ? "is-low" : ""}`}>{isOut ? "Rupture de stock" : `${product.stock} en stock`}</span>
        </div>
        <div className="product-detail-summary">
          <span className="store-eyebrow">{product.categorie?.nom || "Hardware"}</span>
          <h1>{product.nom}</h1>
          {product.description && <p className="product-detail-description">{product.description}</p>}
          {specs.length > 0 && <div className="detail-spec-preview">{specs.slice(0, 3).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
          <div className="product-detail-price"><span>Prix</span><strong>{Number(product.prix).toFixed(2)} €</strong></div>
          <div className="product-detail-actions">
            <button className="button button-primary detail-cart-button" disabled={isOut} onClick={() => addToCart(product)}>{isOut ? "Indisponible" : "Ajouter au panier"}</button>
            <button className={`detail-favorite-button ${isFavorite ? "is-active" : ""}`} onClick={() => toggleFavorite(product)} aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}><HeartIcon filled={isFavorite} /><span>{isFavorite ? "Dans vos favoris" : "Ajouter aux favoris"}</span></button>
          </div>
        </div>
      </section>

      <section className="product-details-content">
        <div>
          <span className="store-eyebrow">Présentation</span>
          <h2>Détails du produit</h2>
          <p>{product.description || "Aucune description détaillée n’est disponible pour ce produit."}</p>
        </div>
        <div className="full-specifications">
          <div className="full-specifications-heading"><span className="store-eyebrow">Données disponibles</span><h2>Spécifications</h2></div>
          {specs.length > 0 ? specs.map(([label, value]) => <div className="specification-row" key={label}><span>{label}</span><strong>{value}</strong></div>) : <p className="specifications-empty">Aucune spécification technique supplémentaire n’est renseignée.</p>}
        </div>
      </section>
    </main>
  );
}
