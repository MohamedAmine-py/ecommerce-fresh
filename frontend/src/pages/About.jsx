import React from "react";
import { Link } from "react-router-dom";

const principles = [
  {
    number: "01",
    title: "Performance first",
    text: "Des ordinateurs, composants et périphériques pensés pour le jeu, la création et les charges de travail exigeantes.",
  },
  {
    number: "02",
    title: "Des informations utiles",
    text: "Prix, disponibilité et caractéristiques techniques sont présentés clairement pour faciliter chaque comparaison.",
  },
  {
    number: "03",
    title: "Pour les passionnés de PC",
    text: "Une expérience directe et lisible, conçue pour celles et ceux qui veulent comprendre le matériel qu'ils choisissent.",
  },
];

export default function About() {
  return (
    <main className="simple-page about-page">
      <header className="simple-page-hero">
        <span className="store-eyebrow">À propos d'Elite PC</span>
        <h1>Le matériel qui compte,<br /><em>présenté clairement.</em></h1>
        <p>
          Elite PC réunit des systèmes et composants haute performance dans une
          boutique pensée pour rendre le choix du matériel plus simple et plus précis.
        </p>
        <Link className="button button-primary" to="/products">Explorer le catalogue</Link>
      </header>

      <section className="about-principles" aria-label="Les principes Elite PC">
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
          <span className="store-eyebrow">Une question avant de choisir ?</span>
          <h2>Elite AI vous aide à comparer le catalogue disponible.</h2>
          <p>Ouvrez le bouton Elite AI pour demander un conseil matériel ou vérifier une compatibilité.</p>
        </div>
        <Link className="button button-secondary" to="/contact">Voir les options d'aide</Link>
      </section>
    </main>
  );
}
