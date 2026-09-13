import React from 'react';
import styles from './SectionTitle.module.css';

const SectionTitle = ({ title, subtitle, centered = true, light = false }) => {
  return (
    <div className={`${styles.sectionTitle} ${centered ? styles.centered : ''} ${light ? styles.light : ''}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.underline}></div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
