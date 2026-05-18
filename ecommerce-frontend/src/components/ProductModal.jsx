const PRODUCT_IMAGES = {
  "iPhone": "https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&h=800&fit=crop",
  "Samsung": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
  "Google": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
  "Pixel": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
  "iPad": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=800&fit=crop",
  "MacBook": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
  "Dell": "https://images.unsplash.com/photo-1588872657840-790ff3a58e7e?w=800&h=800&fit=crop",
  "Asus": "https://images.unsplash.com/photo-1602524206684-88c0199881b2?w=800&h=800&fit=crop",
  "HP": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop",
  "AirPods": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
  "Sony": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
  "Beats": "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop",
  "JBL": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
  "Bose": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
  "TV": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop",
  "Xiaomi": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
  "OnePlus": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop",
  "Apple Watch": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop",
  "Watch": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop",
  "Lenovo": "https://images.unsplash.com/photo-1588872657840-790ff3a58e7e?w=800&h=800&fit=crop",
  "default": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop"
};

export function getProductImage(name = "") {
  for (const [key, url] of Object.entries(PRODUCT_IMAGES)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return url;
  }
  return PRODUCT_IMAGES.default;
}

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  const img = product.image || getProductImage(product.nom);
  const isOut = product.stock === 0;
  const isLimited = !isOut && product.stock <= 5;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .2s ease" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 820, maxHeight: "90vh", overflow: "hidden", display: "flex", boxShadow: "0 40px 80px rgba(0,0,0,0.25)", animation: "scaleIn .25s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Image side */}
        <div style={{ width: "45%", flexShrink: 0, background: "#f8f9fc", position: "relative", overflow: "hidden" }}>
          <img
            src={img}
            alt={product.nom}
            onError={e => { e.target.src = PRODUCT_IMAGES.default; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {isOut && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#ef4444", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>ÉPUISÉ</div>
          )}
          {isLimited && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#f59e0b", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>STOCK LIMITÉ</div>
          )}
        </div>

        {/* Info side */}
        <div style={{ flex: 1, padding: "36px 36px 36px 32px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ff4655", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {product.categorie?.nom || "Tech"}
            </div>
            <button
              onClick={onClose}
              style={{ background: "#f1f4f9", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >✕</button>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>{product.nom}</h2>

          <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>)}
            <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 8, alignSelf: "center" }}>5.0 (124 avis)</span>
          </div>

          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 28, flexGrow: 1 }}>
            {product.description || "Produit électronique haute performance. Conçu pour offrir une expérience utilisateur exceptionnelle avec des matériaux premium et une technologie de pointe."}
          </p>

          <div style={{ padding: "16px 0", borderTop: "1px solid #f1f4f9", borderBottom: "1px solid #f1f4f9", marginBottom: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Disponibilité", val: isOut ? "Épuisé" : `${product.stock} en stock`, color: isOut ? "#ef4444" : "#16a34a" },
                { label: "Catégorie", val: product.categorie?.nom || "Tech", color: "#0f172a" },
                { label: "Référence", val: `SKU-${product.id}`, color: "#64748b" },
                { label: "Garantie", val: "24 mois", color: "#0f172a" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Prix</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#ff4655", fontFamily: "JetBrains Mono,monospace" }}>{parseFloat(product.prix).toFixed(2)} €</div>
            </div>
          </div>

          <button
            disabled={isOut}
            onClick={() => { onAddToCart(product); onClose(); }}
            style={{
              width: "100%", padding: "16px 0", borderRadius: 12, border: "none",
              background: isOut ? "#e2e8f0" : "linear-gradient(135deg,#ff4655,#ff6b77)",
              color: isOut ? "#94a3b8" : "#fff", fontSize: 15, fontWeight: 800,
              cursor: isOut ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif",
              boxShadow: isOut ? "none" : "0 8px 24px rgba(255,70,85,0.35)",
              transition: "all 0.2s", letterSpacing: 0.3
            }}
          >
            {isOut ? "Produit épuisé" : "🛒 Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}
