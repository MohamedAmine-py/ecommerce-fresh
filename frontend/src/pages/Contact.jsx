import React from "react";

const contactDetails = [
  { label: "Email", value: "contact@elitepc.ma" },
  { label: "Phone", value: "+212 6 XX XX XX XX" },
  { label: "Location", value: "Marrakech, Morocco" },
  { label: "Hours", value: "Mon – Sat · 09:00 – 18:00" },
];

export default function Contact() {
  return (
    <main className="simple-page contact-page">
      <header className="simple-page-hero simple-page-hero-compact">
        <span className="store-eyebrow">Contact</span>
        <h1>Let’s talk.</h1>
        <p>
          Contact Elite PC with product questions, order questions, or
          any general inquiry about the store.
        </p>
      </header>

      <div className="contact-layout">
        <section className="contact-form-panel" aria-labelledby="contact-form-title">
          <div className="contact-panel-heading">
            <span>01</span>
            <div>
              <h2 id="contact-form-title">Send a message</h2>
              <p>Tell us how we can help, with as much detail as possible.</p>
            </div>
          </div>

          <form className="contact-form">
            <label className="contact-field">
              <span>Name</span>
              <input name="name" autoComplete="name" />
            </label>

            <label className="contact-field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" />
            </label>

            <label className="contact-field contact-field-wide">
              <span>Subject</span>
              <input name="subject" />
            </label>

            <label className="contact-field contact-field-wide">
              <span>Message</span>
              <textarea name="message" rows="7" />
            </label>

            <div className="contact-submit-row contact-field-wide">
              <button className="button button-primary" type="button">Send message →</button>
            </div>
          </form>
        </section>

        <aside className="contact-details-panel" aria-labelledby="contact-details-title">
          <div className="contact-panel-heading">
            <span>02</span>
            <div>
              <h2 id="contact-details-title">Contact details</h2>
              <p>Ways to reach Elite PC.</p>
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
