import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const LOCAL_IMAGE_FALLBACK = "/pc_logo.png";

function CartItem({ item, updateCartItem, removeFromCart }) {
  const specs = [item.processor, item.graphics_card, item.ram_details, item.storage_details].filter(Boolean).slice(0, 2);

  return (
    <article className="cart-page-item">
      <Link className="cart-page-image" to={`/products/${item.id}`}><img src={item.image || LOCAL_IMAGE_FALLBACK} alt={item.nom} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = LOCAL_IMAGE_FALLBACK; event.currentTarget.classList.add("is-fallback"); }} /></Link>
      <div className="cart-page-product"><span>{item.categorie?.nom || "Hardware"}</span><Link to={`/products/${item.id}`}>{item.nom}</Link>{specs.length > 0 && <p>{specs.join(" · ")}</p>}<button className="cart-remove" onClick={() => removeFromCart(item.id)}>Retirer</button></div>
      <div className="cart-unit-price"><span>Prix unitaire</span><strong>{Number(item.prix).toFixed(2)} €</strong></div>
      <div className="cart-quantity"><span>Quantité</span><div><button onClick={() => updateCartItem(item.id, item.quantite - 1)} aria-label={`Réduire la quantité de ${item.nom}`}>−</button><strong>{item.quantite}</strong><button onClick={() => updateCartItem(item.id, item.quantite + 1)} aria-label={`Augmenter la quantité de ${item.nom}`}>+</button></div></div>
      <div className="cart-line-total"><span>Sous-total</span><strong>{(Number(item.prix) * item.quantite).toFixed(2)} €</strong></div>
    </article>
  );
}

export default function Cart() {
  const { cart, cartCount, cartTotal, user, setAuthOpen, updateCartItem, removeFromCart } = useApp();
  const navigate = useNavigate();
  const proceedToCheckout = () => user ? navigate("/checkout") : setAuthOpen(true);

  return (
    <main className="cart-page storefront-container">
      <header className="cart-page-header"><div><span className="store-eyebrow">Votre sélection</span><h1>Review Your Cart</h1><p>{cartCount} article{cartCount !== 1 ? "s" : ""} dans votre configuration.</p></div><Link className="text-link" to="/products">← Continuer mes achats</Link></header>
      {cart.length === 0 ? (
        <div className="cart-empty store-state"><div className="cart-empty-icon" aria-hidden="true">□</div><h3>Votre panier est vide</h3><p>Explorez le catalogue et ajoutez le matériel adapté à votre prochain système.</p><Link className="button button-primary" to="/products">Découvrir le catalogue</Link></div>
      ) : (
        <div className="cart-page-layout">
          <section className="cart-items" aria-label="Produits dans le panier">{cart.map((item) => <CartItem key={item.id} item={item} updateCartItem={updateCartItem} removeFromCart={removeFromCart} />)}</section>
          <aside className="cart-summary"><span className="store-eyebrow">Récapitulatif</span><h2>Order Summary</h2><div className="summary-row"><span>Sous-total</span><strong>{cartTotal.toFixed(2)} €</strong></div><div className="summary-row"><span>Livraison</span><strong>Confirmée à la commande</strong></div><div className="summary-total"><span>Total estimé</span><strong>{cartTotal.toFixed(2)} €</strong></div><p className="summary-note">Le montant final est recalculé par le serveur à partir des prix actuels du catalogue.</p><button className="button button-primary summary-checkout" onClick={proceedToCheckout}>{user ? "Passer au paiement" : "Se connecter pour commander"} <span>→</span></button><Link className="summary-continue" to="/products">Continuer mes achats</Link></aside>
        </div>
      )}
    </main>
  );
}
