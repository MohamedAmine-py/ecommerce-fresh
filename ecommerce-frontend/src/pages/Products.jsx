import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../api/client";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { search, setSelectedProduct } = useApp();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p.data || []);
      setCategories(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    const ms = p.nom.toLowerCase().includes(search.toLowerCase());
    const mc = !activeCat || Number(p.categorie_id) === Number(activeCat);
    return ms && mc;
  });

  return (
    <div style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>
        Catalogue de Matériels
      </h1>
      <p style={{ color: "var(--text2)", marginBottom: 36 }}>
        Explorez nos composants haut de gamme et configurations Elite PC.
      </p>

      <div className="cats">
        <button
          className={`cat-chip ${activeCat === null ? "active" : ""}`}
          onClick={() => setActiveCat(null)}
        >
          Tous les produits
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`cat-chip ${activeCat === c.id ? "active" : ""}`}
            onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
          >
            {c.nom}
          </button>
        ))}
      </div>

      <div id="products" style={{ marginTop: 24 }}>
        <div className="section-hd">
          <div className="section-title">
            {activeCat ? categories.find((c) => c.id === activeCat)?.nom : "Tous les produits"}
          </div>
          <div className="section-badge">{filtered.length} articles</div>
        </div>

        {loading ? (
          <div className="grid">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg2)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
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
            <p>Essayez un autre terme de recherche ou une autre catégorie.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((p, index) => (
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
    </div>
  );
}
