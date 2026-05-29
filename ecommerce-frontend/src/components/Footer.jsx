import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>À propos</h3>
            <Link to="/about">Qui sommes-nous</Link>
            <Link to="/about">Nos valeurs</Link>
            <Link to="/about">Garanties</Link>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <Link to="/contact">Centre d'aide</Link>
            <Link to="/contact">Retours & échanges</Link>
            <Link to="/contact">Garantie</Link>
          </div>
          <div className="footer-col">
            <h3>Légal</h3>
            <a href="#">Confidentialité</a>
            <a href="#">CGV</a>
            <a href="#">Cookies</a>
          </div>
          <div className="footer-col">
            <h3>Contact</h3>
            <a href="mailto:support@elitepc.com">support@elitepc.com</a>
            <a href="tel:+33123456789">+33 1 23 45 67 89</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Elite PC. Tous droits réservés.</div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Twitter</a>
            <a href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Instagram</a>
            <a href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
