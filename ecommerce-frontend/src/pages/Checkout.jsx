import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { createOrder } from "../api/client";
import { applyProductFallback, productImage } from "../utils/productAssets";

export default function Checkout() {
  const { cart, cartTotal, user, token, toast, clearCart, setAuthOpen } = useApp();
  const [formData, setFormData] = useState({ payment_method: "credit_card", delivery_address: "", delivery_phone: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (formData.delivery_address.trim().length < 10) return "L’adresse de livraison doit contenir au moins 10 caractères.";
    if (formData.delivery_phone.trim().length < 8) return "Le numéro de téléphone doit contenir au moins 8 caractères.";
    if (!/^[0-9+\-\s()]+$/.test(formData.delivery_phone.trim())) return "Le numéro de téléphone contient des caractères non valides.";
    return "";
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      toast(validationError, "error");
      return;
    }

    setFormError("");
    setLoading(true);
    try {
      const order = await createOrder({
        items: cart.map((item) => ({ produit_id: item.id, quantite: item.quantite })),
        payment_method: formData.payment_method,
        delivery_address: formData.delivery_address.trim(),
        delivery_phone: formData.delivery_phone.trim(),
      }, token);

      if (order?.id) {
        setCreatedOrder(order);
        clearCart();
        toast("Commande créée avec succès.", "success");
      } else {
        setFormError(order?.message || "La commande n’a pas pu être créée.");
      }
    } catch (error) {
      const validationMessages = error.data?.errors ? Object.values(error.data.errors).flat().join(" ") : "";
      const message = validationMessages || error.message || "Une erreur est survenue pendant la commande.";
      setFormError(message);
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <main className="checkout-page storefront-container"><div className="store-state"><div className="store-state-mark">ID</div><h3>Connectez-vous pour commander</h3><p>Votre panier reste enregistré pendant la connexion.</p><button className="button button-primary" onClick={() => setAuthOpen(true)}>Se connecter</button></div></main>;
  }

  if (createdOrder) {
    return <main className="checkout-page storefront-container"><div className="checkout-success"><span aria-hidden="true">✓</span><div className="store-eyebrow">Commande enregistrée</div><h1>Merci pour votre commande.</h1><p>La commande #{createdOrder.id} a été créée. Son total confirmé est de <strong>{Number(createdOrder.total).toFixed(2)} €</strong>.</p><Link className="button button-primary" to="/orders">Voir mes commandes</Link></div></main>;
  }

  if (cart.length === 0) {
    return <main className="checkout-page storefront-container"><div className="store-state"><div className="store-state-mark">0</div><h3>Votre panier est vide</h3><p>Ajoutez un produit avant de passer commande.</p><Link className="button button-primary" to="/products">Retour au catalogue</Link></div></main>;
  }

  return (
    <main className="checkout-page storefront-container">
      <header className="checkout-header"><span className="store-eyebrow">Finaliser la commande</span><h1>Checkout</h1><p>Vérifiez vos articles puis renseignez uniquement les informations nécessaires à la livraison et au paiement.</p></header>
      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <div className="checkout-form-column">
          <section className="checkout-panel">
            <div className="checkout-panel-heading"><span>01</span><div><h2>Livraison</h2><p>Adresse et téléphone de contact</p></div></div>
            {formError && <div className="checkout-error" role="alert">{formError}</div>}
            <label className="checkout-field"><span>Adresse de livraison</span><textarea name="delivery_address" value={formData.delivery_address} onChange={handleInputChange} minLength="10" maxLength="500" required placeholder="Adresse complète, ville et code postal" /></label>
            <label className="checkout-field"><span>Numéro de téléphone</span><input type="tel" name="delivery_phone" value={formData.delivery_phone} onChange={handleInputChange} minLength="8" maxLength="20" required placeholder="+212 600 000 000" /></label>
          </section>

          <section className="checkout-panel">
            <div className="checkout-panel-heading"><span>02</span><div><h2>Mode de paiement</h2><p>Sélectionnez une option actuellement prise en charge</p></div></div>
            <div className="payment-options">
              {[["credit_card", "Carte bancaire", "Paiement par carte"], ["paypal", "PayPal", "Paiement via PayPal"], ["cash_on_delivery", "Paiement à la livraison", "Règlement lors de la livraison"]].map(([value, label, description]) => (
                <label className={`payment-option ${formData.payment_method === value ? "is-selected" : ""}`} key={value}><input type="radio" name="payment_method" value={value} checked={formData.payment_method === value} onChange={handleInputChange} /><span className="payment-radio" /><span><strong>{label}</strong><small>{description}</small></span></label>
              ))}
            </div>
            <p className="payment-note">Aucune donnée de carte n’est demandée sur cette page.</p>
          </section>
        </div>

        <aside className="checkout-summary">
          <span className="store-eyebrow">Votre commande</span><h2>Order Summary</h2>
          <div className="checkout-items">{cart.map((item) => <div className="checkout-item" key={item.id}><img src={productImage(item)} alt="" loading="lazy" decoding="async" onError={(event) => applyProductFallback(event, item)} /><div><strong>{item.nom}</strong><span>{item.quantite} × {Number(item.prix).toFixed(2)} €</span></div><b>{(item.quantite * Number(item.prix)).toFixed(2)} €</b></div>)}</div>
          <div className="summary-row"><span>Sous-total estimé</span><strong>{cartTotal.toFixed(2)} €</strong></div>
          <div className="summary-row"><span>Livraison</span><strong>Confirmée à la commande</strong></div>
          <div className="summary-total"><span>Total estimé</span><strong>{cartTotal.toFixed(2)} €</strong></div>
          <p className="summary-note">Le serveur vérifie les prix et le stock avant de créer la commande.</p>
          <button type="submit" className="button button-primary checkout-submit" disabled={loading}>{loading ? "Création en cours…" : "Passer la commande"} <span>→</span></button>
          <Link className="summary-continue" to="/cart">← Retour au panier</Link>
        </aside>
      </form>
    </main>
  );
}
