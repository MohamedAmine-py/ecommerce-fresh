import React from "react";

const contactDetails = [
  { label: "Email", value: "contact@elitepc.ma" },
  { label: "Téléphone", value: "+212 6 XX XX XX XX" },
  { label: "Localisation", value: "Marrakech, Maroc" },
  { label: "Horaires", value: "Lun – Sam · 09:00 – 18:00" },
];

export default function Contact() {
  return (
    <main className="simple-page contact-page">
      <header className="simple-page-hero simple-page-hero-compact">
        <span className="store-eyebrow">Contact</span>
        <h1>Parlons-en.</h1>
        <p>
          Contactez Elite PC pour une question sur un produit, une commande ou
          pour toute demande générale concernant la boutique.
        </p>
      </header>

      <div className="contact-layout">
        <section className="contact-form-panel" aria-labelledby="contact-form-title">
          <div className="contact-panel-heading">
            <span>01</span>
            <div>
              <h2 id="contact-form-title">Envoyer un message</h2>
              <p>Présentez-nous votre demande aussi précisément que possible.</p>
            </div>
          </div>

          <form className="contact-form">
            <label className="contact-field">
              <span>Nom</span>
              <input name="name" autoComplete="name" />
            </label>

            <label className="contact-field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" />
            </label>

            <label className="contact-field contact-field-wide">
              <span>Sujet</span>
              <input name="subject" />
            </label>

            <label className="contact-field contact-field-wide">
              <span>Message</span>
              <textarea name="message" rows="7" />
            </label>

            <div className="contact-submit-row contact-field-wide">
              <button className="button button-primary" type="button">Envoyer le message →</button>
            </div>
          </form>
        </section>

        <aside className="contact-details-panel" aria-labelledby="contact-details-title">
          <div className="contact-panel-heading">
            <span>02</span>
            <div>
              <h2 id="contact-details-title">Coordonnées</h2>
              <p>Informations de contact configurées pour Elite PC.</p>
            </div>
          </div>

          <dl className="contact-details-list">
            {contactDetails.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  );
}
