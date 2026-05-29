import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Contact() {
  const { toast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast("Veuillez remplir les champs obligatoires", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Votre message a été envoyé avec succès ! Notre équipe reviendra vers vous.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div style={{ paddingTop: 40, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "var(--text)" }}>
        Contactez Elite PC
      </h1>
      <p style={{ color: "var(--text2)", marginBottom: 40 }}>
        Une question sur une configuration ou besoin d'un devis sur mesure ? Nous sommes là pour vous.
      </p>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Contact Form */}
        <div style={{ flex: "1 1 500px", background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 20, padding: 32, boxShadow: "var(--shadow)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>
            Envoyer un message
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="f-group">
              <label className="f-label">Nom Complet *</label>
              <input 
                className="f-input" 
                placeholder="Votre nom" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>
            <div className="f-group">
              <label className="f-label">Email de Contact *</label>
              <input 
                className="f-input" 
                type="email" 
                placeholder="vous@example.com" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                required 
              />
            </div>
            <div className="f-group">
              <label className="f-label">Sujet</label>
              <input 
                className="f-input" 
                placeholder="Ex: Devis PC sur mesure" 
                value={form.subject} 
                onChange={e => setForm({ ...form, subject: e.target.value })} 
              />
            </div>
            <div className="f-group">
              <label className="f-label">Message *</label>
              <textarea 
                className="f-input" 
                rows="5" 
                style={{ resize: "vertical", fontFamily: "inherit" }}
                placeholder="Détaillez votre demande ici..." 
                value={form.message} 
                onChange={e => setForm({ ...form, message: e.target.value })} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
              style={{ width: "auto", padding: "12px 32px" }}
            >
              {loading ? "Envoi..." : "Envoyer le Message"}
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 20, padding: 28, boxShadow: "var(--shadow)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>Support Technique</h3>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, marginBottom: 16 }}>
              Notre équipe d'assistance répond à vos questions techniques du lundi au vendredi de 9h à 18h.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <div>📧 **Email :** <a href="mailto:support@elitepc.com" style={{ color: "var(--accent)" }}>support@elitepc.com</a></div>
              <div>📞 **Téléphone :** <a href="tel:+33123456789" style={{ color: "var(--accent)" }}>+33 1 23 45 67 89</a></div>
            </div>
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: 28, color: "#f8fafc", boxShadow: "var(--shadow)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "#00e5ff" }}>Assistant IA 24/7</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
              Besoin d'une réponse immédiate sur la compatibilité d'un CPU, d'une estimation de performance en jeu, ou d'un conseil de montage ? 
              <br/><br/>
              Utilisez notre bulle de clavardage en bas à droite pour poser toutes vos questions à l'**Elite PC Assistant**. Il est disponible à toute heure du jour et de la nuit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
