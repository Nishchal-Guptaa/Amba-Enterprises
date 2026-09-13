import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PageHero.module.css';

const PageHero = ({ title, subtitle, breadcrumbs }) => {
  const normalizedBreadcrumbs = Array.isArray(breadcrumbs)
    ? breadcrumbs
    : breadcrumbs
    ? [{ label: title }]
    : [];

  return (
    <div className={styles.pageHero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {normalizedBreadcrumbs.length > 0 && (
          <nav className={styles.breadcrumbs}>
            <Link to="/">Home</Link>
            {normalizedBreadcrumbs.map((crumb, index) => (
              <span key={index} className={styles.crumbWrapper}>
                <span className={styles.separator}>&gt;</span>
                {crumb.path ? (
                  <Link to={crumb.path}>{crumb.label}</Link>
                ) : (
                  <span className={styles.currentCrumb}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default PageHero;
