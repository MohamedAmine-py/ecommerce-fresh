import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/client";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { setSelectedProduct } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.data || []);
      setLoading(false);
    });
  }, []);

  // Filter 6 premium/pre-built/popular products for curated showcase
  const featured = products.slice(0, 6);

  return (
    <>
      <div className="hero">
        <div className="hero-inner animate-item">
          <div className="hero-tag">New Components & Systems 2026</div>
          <h1 className="hero-title">
            Build Your <em>Dream Rig</em>
            <br />
            No Compromise
          </h1>
          <p className="hero-desc">
            Discover our selection of ultra-high-performance PC hardware. Maximize
            framerates, dominate workloads, and elevate your setup.
          </p>
          <Link to="/products" className="hero-cta" style={{ textDecoration: "none" }}>
            Explorer les produits →
          </Link>
        </div>
      </div>

      <div id="products">
        <div className="section-hd">
          <div className="section-title">Trending Hardware & Featured Rigs</div>
          <div className="section-badge">Curated Elite Specs</div>
        </div>

        {loading ? (
          <div className="grid">
            {[...Array(3)].map((_, i) => (
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
        ) : featured.length === 0 ? (
          <div className="empty">
            <h3>Aucun produit disponible</h3>
            <p>Veuillez repasser plus tard.</p>
          </div>
        ) : (
          <div className="grid">
            {featured.map((p, index) => (
              <ProductCard
                key={p.id}
                product={p}
                index={index}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            to="/products"
            className="empty-btn"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Voir tout le catalogue
          </Link>
        </div>
      </div>
    </>
  );
}
