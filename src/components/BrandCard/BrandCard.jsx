import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BrandCard.module.css';

const BrandCard = ({ brand }) => {
  if (!brand) return null;
  const initial = brand.name ? brand.name.charAt(0).toUpperCase() : '?';
  const brandColor = brand.color || 'var(--primary)';

  return (
    <Link to={`/brands#${brand.id}`} className={styles.brandCard}>
      {brand.priority && <span className={styles.priorityBadge}>Featured</span>}
      <div className={styles.iconWrapper} style={{ backgroundColor: brandColor }}>
        <span className={styles.initial}>{initial}</span>
      </div>
      <h3 className={styles.name}>{brand.name}</h3>
      {brand.note && <span className={styles.note}>{brand.note}</span>}
    </Link>
  );
};

export default BrandCard;
