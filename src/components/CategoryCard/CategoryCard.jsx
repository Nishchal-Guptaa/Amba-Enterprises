import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link to="/products" className={styles.categoryCard}>
      <h3 className={styles.name}>{category.name}</h3>
      <p className={styles.description}>{category.description}</p>
      <span className={styles.link}>View Products &rarr;</span>
    </Link>
  );
};

export default CategoryCard;
