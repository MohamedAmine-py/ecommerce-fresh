import React from "react";
import { Link } from "react-router-dom";

const principles = [
  {
    number: "01",
    title: "Performance first",
    text: "Computers, components, and peripherals selected for gaming, content creation, and demanding workloads.",
  },
  {
    number: "02",
    title: "Useful information",
    text: "Prices, availability, and technical specifications are presented clearly to make every comparison easier.",
  },
  {
    number: "03",
    title: "For PC enthusiasts",
    text: "A direct, readable experience for customers who want to understand the hardware they choose.",
  },
];

export default function About() {
  return (
    <main className="simple-page about-page">
      <header className="simple-page-hero">
        <span className="store-eyebrow">About Elite PC</span>
        <h1>Hardware that matters,<br /><em>presented clearly.</em></h1>
        <p>
          Elite PC brings high-performance systems and components together in a
          store designed to make choosing hardware simpler and more precise.
        </p>
        <Link className="button button-primary" to="/products">Explore the catalog</Link>
      </header>

      <section className="about-principles" aria-label="Elite PC principles">
        {principles.map((principle) => (
          <article className="simple-info-card" key={principle.number}>
            <span className="simple-card-number">{principle.number}</span>
            <h2>{principle.title}</h2>
            <p>{principle.text}</p>
          </article>
        ))}
      </section>

      <section className="simple-callout">
        <div>
          <span className="store-eyebrow">A question before you choose?</span>
          <h2>Elite AI helps you compare the available catalog.</h2>
          <p>Open Elite AI to ask for hardware advice or check compatibility.</p>
        </div>
        <Link className="button button-secondary" to="/contact">View help options</Link>
      </section>
    </main>
  );
}
