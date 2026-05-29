import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/client";
import { useApp } from "../context/AppContext";

export default function Orders() {
  const { user, token, setAuthOpen } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getOrders(token)
        .then((res) => {
          setOrders(Array.isArray(res) ? res : []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!user) {
    return (
      <div style={{ paddingTop: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>
          Mes commandes
        </h1>
        <div className="empty">
          <div className="empty-icon" style={{ opacity: 0.1 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h3>Connectez-vous</h3>
          <p>Pour voir vos commandes, veuillez vous identifier.</p>
          <button className="empty-btn" onClick={() => setAuthOpen(true)}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>
        Mes commandes
      </h1>
      <p style={{ color: "var(--text2)", marginBottom: 36 }}>
        Suivez l'état de vos achats et facturations.
      </p>

      {loading ? (
        <div className="empty">
          <h3>Chargement...</h3>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" style={{ opacity: 0.1 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h3>Aucune commande</h3>
          <p>Vos commandes apparaîtront ici dès validation.</p>
          <Link to="/products" className="empty-btn" style={{ textDecoration: "none" }}>
            Découvrir les produits
          </Link>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="order-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--bg3)",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, color: "var(--text)" }}>
                  Commande #{o.id}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "JetBrains Mono,monospace" }}>
                  {new Date(o.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span className={`s-pill s-${o.statut}`}>
                  {o.statut === "en_cours"
                    ? "En cours"
                    : o.statut === "validee"
                    ? "Validée"
                    : "Annulée"}
                </span>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>
                  {parseFloat(o.total).toFixed(2)} €
                </div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Qté</th>
                  <th>Prix</th>
                  <th style={{ textAlign: "right" }}>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {o.details?.map((d) => (
                  <tr key={d.id}>
                    <td style={{ color: "var(--text)", fontWeight: 600 }}>
                      {d.produit?.nom || "—"}
                    </td>
                    <td>×{d.quantite}</td>
                    <td style={{ fontFamily: "JetBrains Mono,monospace" }}>
                      {parseFloat(d.prix_unitaire).toFixed(2)} €
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        color: "var(--accent)",
                        fontWeight: 700,
                        fontFamily: "JetBrains Mono,monospace",
                      }}
                    >
                      {(d.quantite * d.prix_unitaire).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
