import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGallery.module.css";

const ProductGallery = ({ products }) => {
  return (
    <div className={styles.galleryShell}>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
