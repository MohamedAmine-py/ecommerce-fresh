import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, downloadInvoice } from "../api/client";
import { useApp } from "../context/AppContext";

export default function Orders() {
  const { user, token, setAuthOpen, toast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleDownloadInvoice = async (orderId) => {
    setDownloadingId(orderId);
    try {
      await downloadInvoice(orderId, token);
      toast("Invoice downloaded successfully!", "success");
    } catch (error) {
      toast("Failed to download invoice", "error");
    } finally {
      setDownloadingId(null);
    }
  };

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
                  Commande #{String(o.id).padStart(6, "0")}
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

            {/* Delivery Info */}
            {o.delivery_address && (
              <div style={{ background: "var(--bg3)", padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Delivery Information
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13, color: "var(--text)" }}>
                  <div>
                    <div style={{ color: "var(--text2)", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>ADDRESS</div>
                    <div style={{ fontWeight: 500 }}>{o.delivery_address}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text2)", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>PHONE</div>
                    <div style={{ fontWeight: 500 }}>{o.delivery_phone}</div>
                  </div>
                  {o.estimated_delivery_date && (
                    <div>
                      <div style={{ color: "var(--text2)", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>ESTIMATED DELIVERY</div>
                      <div style={{ fontWeight: 500, color: "var(--accent)" }}>
                        {new Date(o.estimated_delivery_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                  {o.payment_method && (
                    <div>
                      <div style={{ color: "var(--text2)", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>PAYMENT METHOD</div>
                      <div style={{ fontWeight: 500, textTransform: "capitalize" }}>
                        {o.payment_method.replace(/_/g, " ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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

            {/* Action Buttons */}
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button
                onClick={() => handleDownloadInvoice(o.id)}
                disabled={downloadingId === o.id}
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: downloadingId === o.id ? "default" : "pointer",
                  opacity: downloadingId === o.id ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => !downloadingId && (e.target.style.background = "var(--accent-light)")}
                onMouseLeave={(e) => !downloadingId && (e.target.style.background = "var(--accent)")}
              >
                {downloadingId === o.id ? "Downloading..." : "📥 Download Invoice"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
