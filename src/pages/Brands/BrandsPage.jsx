import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, Shield, Award, CheckCircle } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { brands } from '../../data/data';
import styles from './BrandsPage.module.css';

export default function BrandsPage() {
  useScrollAnimation();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const scrollToBrand = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHero 
        title="Our Brands" 
        subtitle="Trusted partners for quality products" 
        breadcrumbs 
      />

      <div className={styles.container}>
        <div className={`animate-on-scroll ${styles.introSection}`}>
          <SectionTitle 
            title="Industry Leading Partners" 
            subtitle="We collaborate with the most trusted manufacturers to bring you reliable, high-quality industrial supplies."
          />
        </div>

        <div className={`animate-on-scroll ${styles.brandGrid}`}>
          {brands.map((brand) => (
            <div 
              key={`grid-${brand.id}`} 
              className={styles.brandCard}
              onClick={() => scrollToBrand(brand.id)}
            >
              <div 
                className={styles.brandLogoPlaceholder} 
                style={{ backgroundColor: brand.color || 'var(--primary-light)' }}
              >
                <span>{brand.name.charAt(0)}</span>
              </div>
              <h3 className={styles.brandCardName}>{brand.name}</h3>
              {brand.note && <span className={styles.brandBadgeSmall}>{brand.note}</span>}
            </div>
          ))}
        </div>

        <div className={styles.detailedSections}>
          {brands.map((brand, index) => {
            const isEven = index % 2 === 0;
            return (
              <section 
                key={brand.id} 
                id={brand.id} 
                className={`animate-on-scroll ${styles.brandDetailSection} ${isEven ? styles.evenSection : styles.oddSection}`}
              >
                <div className={styles.brandContentWrapper}>
                  <div className={styles.brandVisual}>
                    <div 
                      className={styles.largeBrandInitial}
                      style={{ backgroundColor: brand.color || 'var(--primary-light)' }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className={styles.brandInfo}>
                    <div className={styles.brandInfoHeader}>
                      <h2 className={styles.brandName}>{brand.name}</h2>
                      {brand.id === 'unik' && (
                        <div className={styles.priorityBadge}>
                          <Star size={16} /> Priority Partner
                        </div>
                      )}
                      {brand.note && <div className={styles.noteBadge}>{brand.note}</div>}
                    </div>
                    
                    <p className={styles.brandDescription}>
                      {brand.description || `Premium quality products from ${brand.name}, renowned for durability and manufacturing excellence. As an authorized distributor, we ensure authentic products with full manufacturer support.`}
                    </p>
                    
                    {brand.products && brand.products.length > 0 && (
                      <div className={styles.availableProducts}>
                        <h4 className={styles.productsLabel}>Available Products:</h4>
                        <div className={styles.productTags}>
                          {brand.products.map(product => (
                            <span key={product} className={styles.productTag}>
                              <CheckCircle size={14} className={styles.tagIcon} />
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
