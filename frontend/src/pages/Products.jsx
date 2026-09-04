import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../api/client";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton, StorefrontState } from "../components/StorefrontUI";

export default function Products() {
  const { search, setSearch } = useApp();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([productResponse, categoryResponse]) => {
        setProducts(productResponse.data || []);
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
      })
      .catch(() => setError("Products could not be loaded right now."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const ms = p.nom.toLowerCase().includes(search.toLowerCase());
    const mc = !activeCat || Number(p.categorie_id) === Number(activeCat);
    return ms && mc;
  });

  return (
    <main className="catalog-page storefront-container">
      <header className="catalog-header">
        <span className="store-eyebrow">Elite PC Catalog</span>
        <h1>Hardware built for performance.</h1>
        <p>Explore the systems, components, and peripherals currently available.</p>
      </header>

      <section className="catalog-toolbar" aria-label="Catalog filters">
        <label className="catalog-search">
          <span>Search</span>
          <div><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, component, or system..." /></div>
        </label>
        <div className="catalog-categories">
          <span>Category</span>
          <div className="cats">
            <button className={`cat-chip ${activeCat === null ? "active" : ""}`} onClick={() => setActiveCat(null)}>All</button>
            {categories.map((category) => (
              <button key={category.id} className={`cat-chip ${activeCat === category.id ? "active" : ""}`} onClick={() => setActiveCat(activeCat === category.id ? null : category.id)}>{category.nom}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-results" id="products">
        <div className="catalog-results-heading">
          <div><span className="store-eyebrow">Results</span><h2>{activeCat ? categories.find((category) => category.id === activeCat)?.nom : "All products"}</h2></div>
          {!loading && !error && <span className="result-count">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <StorefrontState title="Catalog unavailable" message={error} />
        ) : filtered.length === 0 ? (
          <div className="store-state"><div className="store-state-mark">0</div><h3>No results</h3><p>Try another search term or select a different category.</p><button className="button button-secondary" onClick={() => { setSearch(""); setActiveCat(null); }}>Reset filters</button></div>
        ) : (
          <div className="grid product-grid">
            {filtered.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
