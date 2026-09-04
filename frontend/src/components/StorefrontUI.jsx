import React from "react";
import { Link } from "react-router-dom";

export function SectionHeading({ eyebrow, title, actionLabel, actionTo }) {
  return (
    <div className="store-section-heading">
      <div>
        {eyebrow && <span className="store-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {actionLabel && actionTo && (
        <Link className="text-link" to={actionTo}>
          {actionLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid product-grid" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-skeleton" key={index} aria-hidden="true">
          <div className="skel product-skeleton-image" />
          <div className="product-skeleton-body">
            <div className="skel" style={{ width: "32%", height: 10 }} />
            <div className="skel" style={{ width: "82%", height: 18 }} />
            <div className="skel" style={{ width: "100%", height: 34 }} />
            <div className="skel" style={{ width: "44%", height: 20 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StorefrontState({ title, message, actionLabel, actionTo }) {
  return (
    <div className="store-state" role="status">
      <div className="store-state-mark" aria-hidden="true">EP</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && actionTo && (
        <Link className="button button-secondary" to={actionTo}>{actionLabel}</Link>
      )}
    </div>
  );
}
