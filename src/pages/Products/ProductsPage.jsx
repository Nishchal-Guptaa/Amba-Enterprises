import React, { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { productCategories } from '../../data/data';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  useScrollAnimation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    let result = productCategories;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.map(cat => {
        const catMatches = cat.name.toLowerCase().includes(query) || cat.description.toLowerCase().includes(query);
        const filteredSubs = (cat.subcategories || []).filter(sub => 
          sub.name.toLowerCase().includes(query) || 
          (sub.description && sub.description.toLowerCase().includes(query)) ||
          (sub.brands && sub.brands.some(b => b.toLowerCase().includes(query)))
        );
        
        if (catMatches || filteredSubs.length > 0) {
          return { ...cat, subcategories: filteredSubs };
        }
        return null;
      }).filter(Boolean);
    }
    
    return result;
  }, [searchQuery]);

  return (
    <div className={styles.pageContainer}>
      <PageHero 
        title="Our Products" 
        subtitle="Complete range of pipes, fittings & industrial supplies" 
        breadcrumbs 
      />

      <div className={styles.container}>
        <div className={`animate-on-scroll ${styles.controlsSection}`}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search products, categories, or brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.productsArea}>
          {filteredData.length === 0 ? (
            <div className={styles.noResults}>
              <Package size={48} className={styles.noResultsIcon} />
              <h3>No products found</h3>
              <p>Try adjusting your search query.</p>
              <button 
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredData.map(category => (
              <section key={category.id} className={`animate-on-scroll ${styles.categorySection}`}>
                <div className={styles.categoryHeader}>
                  <SectionTitle title={category.name} subtitle={category.description} leftAlign />
                </div>
                
                <div className={styles.grid}>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    category.subcategories.map(sub => (
                      <div key={sub.id || sub.name} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <div className={styles.cardIconWrapper}>
                            <Package size={24} className={styles.cardIcon} />
                          </div>
                          <h4 className={styles.cardTitle}>{sub.name}</h4>
                        </div>
                        <p className={styles.cardDesc}>{sub.description}</p>
                        
                        {sub.brands && sub.brands.length > 0 && (
                          <div className={styles.cardBrands}>
                            <span className={styles.brandsLabel}>Available in:</span>
                            <div className={styles.brandsTags}>
                              {sub.brands.map(brand => (
                                <span key={brand} className={styles.brandTag}>{brand}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className={styles.noSubcategories}>
                      <p>No subcategories match your search.</p>
                    </div>
                  )}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

