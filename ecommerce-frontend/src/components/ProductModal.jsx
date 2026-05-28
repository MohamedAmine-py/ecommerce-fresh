import React from 'react';

const PRODUCT_IMAGES = {
  "RTX": "https://images.unsplash.com/photo-1678129712036-f0fec2679dc6?w=800&h=800&fit=crop",
  "Intel": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=800&fit=crop",
  "AMD": "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=800&h=800&fit=crop",
  "Corsair": "https://images.unsplash.com/photo-1563158114-e4f6479612c6?w=800&h=800&fit=crop",
  "Logitech": "https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?w=800&h=800&fit=crop",
  "SteelSeries": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
  "NZXT": "https://images.unsplash.com/photo-1555617781-db2d2e1ebc12?w=800&h=800&fit=crop",
  "Desktop": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=800&fit=crop",
  "System": "https://images.unsplash.com/photo-1605648812678-8311a2f9cb24?w=800&h=800&fit=crop",
  "Workstation": "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&h=800&fit=crop",
  "default": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=800&fit=crop"
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

  const specs = [
    { label: "Processor", value: product.processor },
    { label: "Graphics Card", value: product.graphics_card },
    { label: "Memory (RAM)", value: product.ram_details },
    { label: "Storage", value: product.storage_details },
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.categorie?.nom || "Hardware" },
    { label: "Availability", value: isOut ? "Out of Stock" : `${product.stock} Units Available` },
    { label: "Warranty", value: "3 Years Next Level Care" }
  ].filter(s => s.value);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .2s ease" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#0f172a", borderRadius: 24, width: "100%", maxWidth: 900, maxHeight: "90vh", overflow: "hidden", display: "flex", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", border: "1px solid #1e293b", animation: "scaleIn .25s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Image side */}
        <div style={{ width: "45%", flexShrink: 0, background: "#000", position: "relative", overflow: "hidden" }}>
          <img
            src={img}
            alt={product.nom}
            onError={e => { e.target.src = PRODUCT_IMAGES.default; }}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
          />
          {isOut && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#ef4444", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>SOLD OUT</div>
          )}
          {isLimited && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#f59e0b", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>LIMITED STOCK</div>
          )}
        </div>

        {/* Info side */}
        <div style={{ flex: 1, padding: "36px 36px 36px 32px", overflowY: "auto", display: "flex", flexDirection: "column", background: "#0f172a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#06b6d4", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {product.categorie?.nom || "Hardware"}
            </div>
            <button
              onClick={onClose}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >✕</button>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f8fafc", lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>{product.nom}</h2>

          <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>)}
            <span style={{ fontSize: 13, color: "#64748b", marginLeft: 8, alignSelf: "center" }}>5.0 (Pro Verified)</span>
          </div>

          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, marginBottom: 28 }}>
            {product.description || "High-performance PC hardware component."}
          </p>

          <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden", marginBottom: 28, flexGrow: 1 }}>
            <div style={{ padding: "12px 16px", background: "#0f172a", borderBottom: "1px solid #334155", fontSize: 12, fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Technical Specifications
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", padding: "8px 0" }}>
              {specs.map((item, i) => (
                <div key={item.label} style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "8px 16px", borderBottom: i < specs.length - 1 ? "1px solid #334155" : "none" }}>
                  <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "#f8fafc", fontFamily: "Inter, sans-serif" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Price</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#06b6d4", fontFamily: "JetBrains Mono,monospace" }}>€{parseFloat(product.prix).toFixed(2)}</div>
            </div>
          </div>

          <button
            disabled={isOut}
            onClick={() => { onAddToCart(product); onClose(); }}
            style={{
              width: "100%", padding: "16px 0", borderRadius: 12, border: "none",
              background: isOut ? "#334155" : "linear-gradient(135deg, #06b6d4, #3b82f6)",
              color: isOut ? "#64748b" : "#fff", fontSize: 15, fontWeight: 800,
              cursor: isOut ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif",
              boxShadow: isOut ? "none" : "0 8px 24px rgba(6, 182, 212, 0.3)",
              transition: "all 0.2s", letterSpacing: 0.3
            }}
          >
            {isOut ? "OUT OF STOCK" : "🛒 ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
