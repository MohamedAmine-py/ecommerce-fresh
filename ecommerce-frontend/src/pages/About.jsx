import React from "react";

export default function About() {
  return (
    <div style={{ paddingTop: 60, paddingBottom: 60, maxWidth: 800, margin: "0 auto" }}>
      <div 
        style={{ 
          background: "#0f172a", 
          borderRadius: 24, 
          border: "1px solid #1e293b", 
          padding: "48px 40px", 
          boxShadow: "0 20px 48px rgba(0,0,0,0.4)",
          color: "#f8fafc"
        }}
      >
        <h1 
          style={{ 
            fontSize: "clamp(32px, 4vw, 44px)", 
            fontWeight: 900, 
            letterSpacing: "-1.5px", 
            marginBottom: 24, 
            background: "linear-gradient(135deg, #00e5ff, #00b8d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          L'Histoire d'Elite PC
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 36 }}>
          Fondée par des passionnés de hardware et de gaming compétitif, **Elite PC** est la destination ultime des joueurs et créateurs exigeant des performances sans compromis. Nous croyons que chaque pixel compte, chaque seconde d'encodage est précieuse, et chaque configuration mérite une attention millimétrée.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #1e293b", marginBottom: 36 }} />

        {/* Mission Statement */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#00e5ff" }}>⚡</span> Notre Mission
          </h2>
          <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
            Notre mission est de démocratiser l'accès à la puissance de calcul ultime. Nous sélectionnons rigoureusement les meilleurs processeurs, cartes graphiques et puces mémoire du marché pour assembler des machines capables de dompter les jeux les plus gourmands et les tâches de rendu professionnel les plus lourdes.
          </p>
        </section>

        {/* Commitment to Elite Configurations */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#00e5ff" }}>🛡️</span> Configurations d'Élite
          </h2>
          <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
            Chaque machine assemblée chez Elite PC fait l'objet de tests de stabilité thermique poussés. Nous n'utilisons que des composants de marques certifiées (Intel, AMD, NVIDIA, Corsair, Samsung, G.Skill, NZXT) afin de garantir une fiabilité sur le long terme et d'éviter tout goulot d'étranglement. Nos experts soignent le câblage (cable management) pour optimiser l'airflow et l'esthétique de votre setup.
          </p>
        </section>

        {/* Shipping & Assembly Guarantees */}
        <section style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#00e5ff" }}>📦</span> Garanties d'Assemblage & Livraison
          </h2>
          <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 14 }}>
            - **Garantie Constructeur de 3 Ans** : Toutes nos configurations et pièces bénéficient d'un support premium d'Elite PC Care.
            <br />
            - **Livraison Sécurisée Blindée** : Nos ordinateurs sont expédiés dans des emballages renforcés doubles cartons contenant des mousses expansées moulées sur mesure pour protéger la carte graphique et le système de refroidissement liquide pendant le transport.
            <br />
            - **Support 24/7** : Notre Assistant Intelligent Elite PC et nos techniciens dédiés se tiennent prêts à vous guider dans toutes vos étapes de mise en route ou de diagnostic.
          </p>
        </section>
      </div>
    </div>
  );
}
