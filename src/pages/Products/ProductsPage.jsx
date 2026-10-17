import React, { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { productCategories } from '../../data/data';
import styles from './ProductsPage.module.css';

/* ─── Subcategory card with always-visible image gallery ─── */
function SubcategoryCard({ sub }) {
  const [active, setActive] = useState(0);
  const images = sub.images || [];

  return (
    <div className={styles.subCard}>
      {/* Gallery */}
      {images.length > 0 && (
        <div className={styles.gallery}>
          <div className={styles.galleryMain}>
            <img
              src={images[active].src}
              alt={images[active].caption}
              className={styles.galleryMainImg}
            />
            <span className={styles.galleryCaption}>{images[active].caption}</span>
          </div>
          {images.length > 1 && (
            <div className={styles.galleryThumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={img.caption}
                >
                  <img src={img.src} alt={img.caption} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className={styles.subCardInfo}>
        <div className={styles.subCardHeader}>
          <Package size={16} className={styles.subCardIcon} />
          <h4 className={styles.subCardName}>{sub.name}</h4>
        </div>
        <p className={styles.subCardDesc}>{sub.description}</p>

        {sub.brands && sub.brands.length > 0 && (
          <div className={styles.brandsTags}>
            {sub.brands.map(brand => (
              <span key={brand} className={styles.brandTag}>{brand}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Category section ─── */
function CategorySection({ category }) {
  return (
    <section className={`animate-on-scroll ${styles.categorySection}`}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon}>{category.icon}</span>
        <SectionTitle title={category.name} subtitle={category.description} />
      </div>

      <div className={styles.subGrid}>
        {category.subcategories && category.subcategories.map(sub => (
          <SubcategoryCard key={sub.name} sub={sub} />
        ))}
      </div>
    </section>
  );
}

/* ─── Main page ─── */
export default function ProductsPage() {
  useScrollAnimation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return productCategories;
    const query = searchQuery.toLowerCase();
    return productCategories.map(cat => {
      const catMatches =
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query);
      const filteredSubs = (cat.subcategories || []).filter(sub =>
        sub.name.toLowerCase().includes(query) ||
        (sub.description && sub.description.toLowerCase().includes(query)) ||
        (sub.brands && sub.brands.some(b => b.toLowerCase().includes(query)))
      );
      if (catMatches || filteredSubs.length > 0) {
        return { ...cat, subcategories: catMatches ? cat.subcategories : filteredSubs };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  return (
    <div className={styles.pageContainer}>
      <PageHero
        title="Our Products"
        subtitle="Complete range of pipes, fittings & industrial supplies"
        breadcrumbs
      />

      <div className={styles.container}>
        {/* Search */}
        <div className={`animate-on-scroll ${styles.controlsSection}`}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search products, categories, or brands..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.productsArea}>
          {filteredData.length === 0 ? (
            <div className={styles.noResults}>
              <Package size={48} className={styles.noResultsIcon} />
              <h3>No products found</h3>
              <p>Try adjusting your search query.</p>
              <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                Clear Search
              </button>
            </div>
          ) : (
            filteredData.map(category => (
              <CategorySection key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
