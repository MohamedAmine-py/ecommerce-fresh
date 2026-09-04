import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/client";
import useApp from "../context/useApp";
import { StorefrontState } from "../components/StorefrontUI";
import { formatCurrency } from "../utils/currency";

const statusLabel = { en_cours: "In progress", validee: "Confirmed", annulee: "Cancelled" };

export default function Orders() {
  const { user, token } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getOrders(token)
      .then((response) => setOrders(Array.isArray(response) ? response : []))
      .catch((requestError) => setError(requestError.message || "Orders could not be loaded."))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) return <main className="orders-page"><StorefrontState title="Sign in to view your orders" message="Your order history is available after you sign in." actionLabel="Sign In" actionTo="/login" /></main>;

  return (
    <main className="orders-page">
      <header className="orders-header">
        <div><span className="store-eyebrow">Your account</span><h1>My Orders</h1><p>Review your purchases and open an order for its full details and invoice.</p></div>
        {!loading && !error && <span className="result-count">{orders.length} order{orders.length === 1 ? "" : "s"}</span>}
      </header>
      {loading ? <div className="orders-loading" aria-label="Loading orders">{[0, 1, 2].map((key) => <div className="skel" key={key} />)}</div>
        : error ? <StorefrontState title="Orders unavailable" message={error} />
        : orders.length === 0 ? <StorefrontState title="No orders yet" message="Your completed purchases will appear here." actionLabel="Shop Hardware" actionTo="/products" />
        : <div className="orders-list">{orders.map((order) => (
          <article className="order-list-card" key={order.id}>
            <div className="order-list-id"><span>Order number</span><strong>#{String(order.id).padStart(6, "0")}</strong></div>
            <div><span>Placed</span><strong>{new Date(order.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</strong></div>
            <div><span>Status</span><strong className={`order-status is-${order.statut}`}>{statusLabel[order.statut] || order.statut}</strong></div>
            <div><span>Total</span><strong className="order-list-total">{formatCurrency(order.total)}</strong></div>
            <Link className="button button-secondary order-view" to={`/orders/${order.id}`}>View Details</Link>
          </article>
        ))}</div>}
    </main>
  );
}
