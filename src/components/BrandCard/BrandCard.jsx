import React from "react";
import styles from "./BrandCard.module.css";

const BrandCard = ({ brand }) => {
  if (!brand) return null;
  const initial = brand.name ? brand.name.charAt(0).toUpperCase() : "?";
  const brandColor = brand.color || "var(--primary)";

  return (
    <article className={styles.brandCard}>
      {brand.priority && <span className={styles.priorityBadge}>Featured</span>}
      <div className={styles.brandLink}>
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: brandColor }}>
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            className={styles.logo}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
          <span className={styles.initial}>{initial}</span>
        </div>
        <h3 className={styles.name}>{brand.name}</h3>
      </div>
      {brand.note && <span className={styles.note}>{brand.note}</span>}
      {brand.website && brand.website !== "#" && (
        <a
          href={brand.website}
          className={styles.websiteLink}
          target="_blank"
          rel="noreferrer">
          Visit website
        </a>
      )}
    </article>
  );
};

export default BrandCard;
