import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="footer-logo" to="/" aria-label="Elite PC home"><BrandLogo variant="dark-surface" /></Link>
            <p>Matériel et systèmes PC haute performance, réunis dans une expérience claire et exigeante.</p>
          </div>
          <div className="footer-col">
            <h3>Boutique</h3>
            <Link to="/products">Tous les produits</Link>
            <Link to="/favorites">Favoris</Link>
          </div>
          <div className="footer-col">
            <h3>Elite PC</h3>
            <Link to="/about">À propos</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h3>Votre compte</h3>
            <Link to="/orders">Commandes</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Elite PC. Tous droits réservés.</div>
          <span>Conçu pour le matériel qui compte.</span>
        </div>
      </div>
    </footer>
  );
}
