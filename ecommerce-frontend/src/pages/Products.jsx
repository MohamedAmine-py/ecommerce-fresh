import React, { useEffect, useMemo, useState } from "react";
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
      .catch(() => setError("Impossible de charger les produits pour le moment."))
      .finally(() => setLoading(false));
  }, []);

  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    return categories.filter((category) => {
      const key = String(category.nom || category.id).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [categories]);

  const uniqueProducts = useMemo(() => {
    const seen = new Set();

    return products.filter((product) => {
      const signature = JSON.stringify([
        product.nom,
        product.categorie?.nom,
        Number(product.prix),
        product.description,
        product.image,
        product.brand,
        product.processor,
        product.graphics_card,
        product.ram_details,
        product.storage_details,
        product.is_custom_build,
      ]);

      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
  }, [products]);

  const filtered = uniqueProducts.filter((p) => {
    const ms = p.nom.toLowerCase().includes(search.toLowerCase());
    const mc = !activeCat || Number(p.categorie_id) === Number(activeCat);
    return ms && mc;
  });

  return (
    <main className="catalog-page storefront-container">
      <header className="catalog-header">
        <span className="store-eyebrow">Catalogue Elite PC</span>
        <h1>Matériel conçu pour la performance.</h1>
        <p>Explorez les systèmes, composants et périphériques actuellement disponibles.</p>
      </header>

      <section className="catalog-toolbar" aria-label="Filtres du catalogue">
        <label className="catalog-search">
          <span>Rechercher</span>
          <div><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, composant ou système..." /></div>
        </label>
        <div className="catalog-categories">
          <span>Catégorie</span>
          <div className="cats">
            <button className={`cat-chip ${activeCat === null ? "active" : ""}`} onClick={() => setActiveCat(null)}>Tous</button>
            {uniqueCategories.map((category) => (
              <button key={category.id} className={`cat-chip ${activeCat === category.id ? "active" : ""}`} onClick={() => setActiveCat(activeCat === category.id ? null : category.id)}>{category.nom}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-results" id="products">
        <div className="catalog-results-heading">
          <div><span className="store-eyebrow">Résultats</span><h2>{activeCat ? uniqueCategories.find((category) => category.id === activeCat)?.nom : "Tous les produits"}</h2></div>
          {!loading && !error && <span className="result-count">{filtered.length} produit{filtered.length !== 1 ? "s" : ""}</span>}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <StorefrontState title="Catalogue indisponible" message={error} />
        ) : filtered.length === 0 ? (
          <div className="store-state"><div className="store-state-mark">0</div><h3>Aucun résultat</h3><p>Essayez un autre terme de recherche ou sélectionnez une autre catégorie.</p><button className="button button-secondary" onClick={() => { setSearch(""); setActiveCat(null); }}>Réinitialiser les filtres</button></div>
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
