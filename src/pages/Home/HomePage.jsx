import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { brands, strengths, productCategories, companyInfo } from '../../data/data';

// Component Imports
import HeroSection from '../../components/HeroSection/HeroSection';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import BrandCard from '../../components/BrandCard/BrandCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import StrengthCard from '../../components/StrengthCard/StrengthCard';

const HomePage = () => {
  useScrollAnimation();

  return (
    <div className={styles.homePage}>
      <HeroSection />

      {/* About Preview Section */}
      <section className={styles.aboutPreview}>
        <div className={`${styles.aboutLeft} animate-on-scroll`}>
          <h2 className={styles.aboutTitle}>About Amba Enterprises</h2>
          <p className={styles.aboutText}>
            Established in Gurugram, Amba Enterprises has grown to become one of the most trusted distributors and suppliers of high-quality pipes, fittings, and industrial products in the region.
          </p>
          <p className={styles.aboutText}>
            We proudly serve contractors, builders, retailers, and industrial clients by offering top brands at competitive prices with a commitment to uncompromised quality and timely delivery.
          </p>
          <Link to="/about" className={styles.learnMoreBtn}>Learn More</Link>
        </div>
        
        <div className={`${styles.aboutRight} animate-on-scroll`}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companyInfo.stats?.experience || '10+'} Years</div>
            <div className={styles.statLabel}>Experience</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companyInfo.stats?.products || '500+'}</div>
            <div className={styles.statLabel}>Products</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companyInfo.stats?.brands || '6+'}</div>
            <div className={styles.statLabel}>Trusted Brands</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companyInfo.stats?.customers || '1000+'}</div>
            <div className={styles.statLabel}>Happy Customers</div>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className={styles.brandsSection}>
        <div className="animate-on-scroll">
          <SectionTitle 
            title="Our Trusted Brands" 
            subtitle="We partner with India's leading manufacturers to bring you the best"
          />
        </div>
        
        <div className={styles.brandsGrid}>
          {brands.map((brand, index) => (
            <div key={brand.id} className="animate-on-scroll" style={{ transitionDelay: `${index * 100}ms` }}>
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
        
        <div className="animate-on-scroll">
          <Link to="/brands" className={styles.viewAllBtn}>View All Brands</Link>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className={styles.productsSection}>
        <div className="animate-on-scroll">
          <SectionTitle 
            title="Our Products" 
            subtitle="Complete range of pipes, fittings & industrial supplies"
          />
        </div>
        
        <div className={styles.productsGrid}>
          {productCategories.map((category, index) => (
            <div key={category.id} className="animate-on-scroll" style={{ transitionDelay: `${index * 100}ms` }}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyUsSection}>
        <div className="animate-on-scroll">
          <SectionTitle 
            title="Why Choose Amba Enterprises" 
            light={true}
          />
        </div>
        
        <div className={styles.whyUsGrid}>
          {strengths.map((strength, index) => (
            <div key={strength.id || index} className="animate-on-scroll" style={{ transitionDelay: `${index * 100}ms` }}>
              <StrengthCard strength={strength} />
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry CTA Section */}
      <section className={styles.ctaSection}>
        <div className="animate-on-scroll">
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaSubtitle}>Contact us for the best prices on pipes, fittings, and industrial products.</p>
          <div className={styles.ctaButtons}>
            <a href={`mailto:${companyInfo.email}`} className={styles.ctaBtn}>Email Us</a>
            <a href={`tel:${Array.isArray(companyInfo.phones) ? companyInfo.phones[0] : (Array.isArray(companyInfo.phone) ? companyInfo.phone[0] : companyInfo.phone || '')}`} className={styles.ctaBtnOutline}>Call Now</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
