import React from "react";
import { ExternalLink } from "lucide-react";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const targetUrl = product.website || product.link;

  return (
    <article className={styles.card} tabIndex={0}>
      <div className={styles.imageFrame}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.primaryImage}
          loading="lazy"
        />

        <div className={styles.overlay}>
          <h3 className={styles.title}>{product.name}</h3>
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          {targetUrl && (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.redirectBtn}
              aria-label={`Visit ${product.name} website`}>
              <span>Visit Website</span>
              <ExternalLink size={14} className={styles.linkIcon} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

