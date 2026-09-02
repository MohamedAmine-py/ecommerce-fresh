import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getProducts } from "../api/client";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton, SectionHeading, StorefrontState } from "../components/StorefrontUI";

const LOCAL_HARDWARE_FALLBACK = "/pc_logo.png";

export default function Home() {
  const { setSelectedProduct } = useApp();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([productResponse, categoryResponse]) => {
        setProducts(productResponse.data || []);
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
      })
      .catch(() => setError("Impossible de charger le catalogue pour le moment."))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 4);
  const heroImage = featured.find((product) => product.image)?.image || LOCAL_HARDWARE_FALLBACK;

  const uniqueCategories = useMemo(() => {
    const seen = new Set();

    return categories.filter((category) => {
      const key = String(category.nom || category.id).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [categories]);

  const imageForCategory = (category) =>
    products.find((product) => Number(product.categorie_id) === Number(category.id))?.image ||
    LOCAL_HARDWARE_FALLBACK;

  const handleCategoryImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = LOCAL_HARDWARE_FALLBACK;
    event.currentTarget.classList.add("is-fallback");
  };

  return (
    <>
      <section className="hero" style={{ "--hero-image": `url("${heroImage}")` }}>
        <div className="hero-inner animate-item storefront-container">
          <div className="hero-tag">Elite PC · Hardware haute performance</div>
          <h1 className="hero-title">
            Built for <em>Performance</em>
          </h1>
          <p className="hero-desc">
            Des composants exigeants aux machines complètes, découvrez du matériel
            pensé pour le jeu, la création et les charges de travail intensives.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="button button-primary">Voir le catalogue <span>→</span></Link>
            <Link to="/about" className="button button-secondary">Découvrir Elite PC</Link>
          </div>
        </div>
      </section>

      <main className="home-content storefront-container">
        <section className="home-section category-section">
          <SectionHeading eyebrow="Catalogue" title="Browse by Category" />
          {loading ? (
            <div className="category-grid category-grid-loading">
              {Array.from({ length: 5 }, (_, index) => <div className="skel category-card" key={index} />)}
            </div>
          ) : uniqueCategories.length > 0 ? (
            <div className="category-grid">
              {uniqueCategories.map((category) => (
                <Link className="category-card" to="/products" key={category.id}>
                  <img
                    src={imageForCategory(category)}
                    alt=""
                    onError={handleCategoryImageError}
                    className={imageForCategory(category) === LOCAL_HARDWARE_FALLBACK ? "is-fallback" : ""}
                  />
                  <span className="category-card-shade" />
                  <span className="category-name">{category.nom}</span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        <section className="home-section" id="products">
          <SectionHeading
            eyebrow="Sélection actuelle"
            title="Featured Hardware & Rigs"
            actionLabel="Voir tout"
            actionTo="/products"
          />

        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <StorefrontState title="Catalogue indisponible" message={error} actionLabel="Ouvrir le catalogue" actionTo="/products" />
        ) : featured.length === 0 ? (
          <StorefrontState title="Aucun produit disponible" message="Le catalogue ne contient pas encore de produits." />
        ) : (
          <div className="grid product-grid">
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

        </section>

        <section className="promo-panel">
          <div className="promo-copy">
            <span className="store-eyebrow">Votre prochain système</span>
            <h2>La performance commence par les bons composants.</h2>
            <p>Explorez les machines, composants et périphériques disponibles, comparez leurs caractéristiques réelles et choisissez la configuration adaptée à votre usage.</p>
            <div className="promo-actions">
              <Link className="button button-primary" to="/products">Explorer le matériel</Link>
              <Link className="text-link" to="/contact">Besoin d’aide ?</Link>
            </div>
          </div>
          <div className="promo-image" style={{ backgroundImage: `url("${heroImage}")` }} role="img" aria-label="Matériel informatique Elite PC" />
        </section>

        <section className="benefits" aria-label="Les avantages de la boutique">
          <article><span className="benefit-icon">01</span><h3>Informations techniques</h3><p>Les spécifications disponibles sont présentées clairement pour chaque produit.</p></article>
          <article><span className="benefit-icon">02</span><h3>Stock visible</h3><p>La disponibilité affichée provient directement du catalogue Elite PC.</p></article>
          <article><span className="benefit-icon">03</span><h3>Parcours simple</h3><p>Favoris, panier et commandes restent accessibles depuis une navigation cohérente.</p></article>
          <article><span className="benefit-icon">04</span><h3>Conseils à portée de main</h3><p>Le support et l’assistant Elite AI sont disponibles depuis la boutique.</p></article>
        </section>
      </main>
    </>
  );
}
