import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { createOrder } from "../api/client";

export default function Checkout() {
  const { cart, user, token, toast, setCart, setCartOpen } = useApp();
  const [step, setStep] = useState(1); // 1: Review, 2: Shipping, 3: Payment, 4: Confirmation
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    payment_method: "credit_card",
    delivery_address: "",
    delivery_phone: "",
  });

  // Calculate order total
  const subtotal = cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  // Calculate delivery date (3 business days)
  const calculateDeliveryDate = () => {
    const today = new Date();
    let businessDays = 0;
    let deliveryDate = new Date(today);

    while (businessDays < 3) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      const dayOfWeek = deliveryDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }

    return deliveryDate;
  };

  const deliveryDate = calculateDeliveryDate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 2) {
      if (!formData.delivery_address.trim()) {
        toast("Please enter a delivery address", "error");
        return false;
      }
      if (formData.delivery_address.trim().length < 10) {
        toast("Address must be at least 10 characters", "error");
        return false;
      }
      if (!formData.delivery_phone.trim()) {
        toast("Please enter a phone number", "error");
        return false;
      }
      if (formData.delivery_phone.trim().length < 8) {
        toast("Phone number must be at least 8 characters", "error");
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          produit_id: item.id,
          quantite: item.quantite,
        })),
        payment_method: formData.payment_method,
        delivery_address: formData.delivery_address,
        delivery_phone: formData.delivery_phone,
      };

      const response = await createOrder(orderData, token);

      if (response.id) {
        toast("Order placed successfully!", "success");
        setCart([]);
        setStep(4);
      } else {
        toast(response.message || "Failed to place order", "error");
      }
    } catch (error) {
      toast(error.message || "Error placing order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ paddingTop: 40 }}>
        <div className="empty">
          <h3>Please log in to checkout</h3>
          <p>You need to be logged in to place an order.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== 4) {
    return (
      <div style={{ paddingTop: 40 }}>
        <div className="empty">
          <h3>Your cart is empty</h3>
          <p>Add items to your cart before checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>
        Checkout
      </h1>

      {/* Step Indicator */}
      <div style={{ display: "flex", gap: 16, marginBottom: 40, marginTop: 24 }}>
        {[
          { num: 1, label: "Review Order" },
          { num: 2, label: "Shipping" },
          { num: 3, label: "Payment" },
          { num: 4, label: "Confirmation" },
        ].map((s) => (
          <div
            key={s.num}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: step >= s.num ? "pointer" : "default",
              opacity: step >= s.num ? 1 : 0.4,
            }}
            onClick={() => step >= s.num && setStep(s.num)}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
                background: step >= s.num ? "var(--accent)" : "var(--bg3)",
                color: step >= s.num ? "#0f172a" : "var(--text2)",
                border: step === s.num ? "2px solid var(--accent)" : "none",
              }}
            >
              {s.num}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
        {/* Main Content */}
        <div>
          {/* Step 1: Review Order */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "var(--text)" }}>
                  Order Summary
                </h2>
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: 16, textAlign: "left", fontWeight: 700, fontSize: 13, color: "var(--text2)" }}>
                          Product
                        </th>
                        <th style={{ padding: 16, textAlign: "center", fontWeight: 700, fontSize: 13, color: "var(--text2)" }}>
                          Qty
                        </th>
                        <th style={{ padding: 16, textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text2)" }}>
                          Price
                        </th>
                        <th style={{ padding: 16, textAlign: "right", fontWeight: 700, fontSize: 13, color: "var(--text2)" }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: 16, color: "var(--text)", fontWeight: 600 }}>{item.nom}</td>
                          <td style={{ padding: 16, textAlign: "center", color: "var(--text2)" }}>×{item.quantite}</td>
                          <td style={{ padding: 16, textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--text2)" }}>
                            €{parseFloat(item.prix).toFixed(2)}
                          </td>
                          <td style={{ padding: 16, textAlign: "right", fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--accent)" }}>
                            €{(item.prix * item.quantite).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                style={{
                  background: "var(--accent)",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 24px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "var(--accent-light)")}
                onMouseLeave={(e) => (e.target.style.background = "var(--accent)")}
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>
                Delivery Address & Information
              </h2>

              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                    Delivery Address *
                  </label>
                  <textarea
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleInputChange}
                    placeholder="Enter your full delivery address..."
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1.5px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--bg3)",
                      color: "var(--text)",
                      fontFamily: "inherit",
                      fontSize: 14,
                      minHeight: 100,
                      resize: "vertical",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="delivery_phone"
                    value={formData.delivery_phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number..."
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1.5px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--bg3)",
                      color: "var(--text)",
                      fontFamily: "inherit",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    background: "var(--bg3)",
                    color: "var(--text)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 8,
                    padding: "14px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "var(--bg4)")}
                  onMouseLeave={(e) => (e.target.style.background = "var(--bg3)")}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1,
                    background: "var(--accent)",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: 8,
                    padding: "14px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "var(--accent-light)")}
                  onMouseLeave={(e) => (e.target.style.background = "var(--accent)")}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>
                Payment Method
              </h2>

              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                {[
                  { value: "credit_card", label: "Credit Card", icon: "💳" },
                  { value: "paypal", label: "PayPal", icon: "🅿️" },
                  { value: "cash_on_delivery", label: "Cash on Delivery", icon: "💵" },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setFormData((prev) => ({ ...prev, payment_method: option.value }))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 16,
                      marginBottom: 12,
                      border: formData.payment_method === option.value ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                      borderRadius: 8,
                      background: formData.payment_method === option.value ? "rgba(0, 229, 255, 0.05)" : "var(--bg3)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        formData.payment_method === option.value ? "var(--accent)" : "var(--border)")
                    }
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 50,
                        border: "2px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: formData.payment_method === option.value ? "var(--accent)" : "transparent",
                        borderColor: formData.payment_method === option.value ? "var(--accent)" : "var(--border)",
                      }}
                    >
                      {formData.payment_method === option.value && <div style={{ width: 8, height: 8, background: "#0f172a", borderRadius: 50 }} />}
                    </div>
                    <span style={{ fontSize: 16 }}>{option.icon}</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{option.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    background: "var(--bg3)",
                    color: "var(--text)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 8,
                    padding: "14px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "var(--bg4)")}
                  onMouseLeave={(e) => (e.target.style.background = "var(--bg3)")}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={true}
                  style={{
                    flex: 1,
                    background: "var(--accent)",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: 8,
                    padding: "14px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "default",
                  }}
                >
                  Payment Info (Demo)
                </button>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "var(--bg4)" : "var(--accent)",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 24px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? "default" : "pointer",
                  marginTop: 12,
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => !loading && (e.target.style.background = "var(--accent-light)")}
                onMouseLeave={(e) => !loading && (e.target.style.background = "var(--accent)")}
              >
                {loading ? "Processing..." : "Complete Order"}
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✓</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, color: "var(--accent)" }}>
                Order Confirmed!
              </h2>
              <p style={{ fontSize: 16, color: "var(--text2)", marginBottom: 32 }}>
                Thank you for your purchase. You will receive an email confirmation shortly.
              </p>
              <a
                href="/orders"
                style={{
                  display: "inline-block",
                  background: "var(--accent)",
                  color: "#0f172a",
                  padding: "14px 32px",
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "var(--accent-light)")}
                onMouseLeave={(e) => (e.target.style.background = "var(--accent)")}
              >
                View My Orders
              </a>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
          <div style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "var(--text)" }}>
              Order Summary
            </h3>

            {step !== 4 && (
              <>
                <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: "var(--text2)" }}>Subtotal:</span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--text2)" }}>VAT (20%):</span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>€{vat.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 16, fontWeight: 800 }}>
                  <span style={{ color: "var(--text)" }}>Total:</span>
                  <span style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>€{total.toFixed(2)}</span>
                </div>

                <div style={{ background: "var(--bg3)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", marginBottom: 6 }}>
                    Estimated Delivery
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>
                    {deliveryDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>

                <button
                  onClick={() => setCartOpen(true)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(0, 229, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Edit Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
