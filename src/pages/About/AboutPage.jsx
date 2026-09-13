import React from 'react';
import styles from './AboutPage.module.css';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { companyInfo } from '../../data/data';

// Component Imports
import PageHero from '../../components/PageHero/PageHero';

// Icons
import { 
  Eye, 
  Target, 
  ShieldCheck, 
  Clock, 
  Smile, 
  BadgeCheck,
  Verified,
  IndianRupee, 
  Handshake,
  Building2,
  Landmark,
  Factory,
  Building,
  icons
} from 'lucide-react';

const AboutPage = () => {
  useScrollAnimation();

  return (
    <div className={styles.aboutPage}>
      <PageHero 
        title="About Us" 
        subtitle="Know more about Amba Enterprises" 
        breadcrumbs={[
          { label: 'Home', path: '/' }, 
          { label: 'About Us' }
        ]} 
      />

      {/* Company Story Section */}
      <section className={styles.storySection}>
        <div className={`${styles.storyLeft} animate-on-scroll`}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.storyText}>
            Established in the year 2011 in Gurugram, Amba Enterprises started with a simple vision: to bridge the gap between quality manufacturing and the growing infrastructural needs of the region.
          </p>
          <p className={styles.storyText}>
            Over the years, we have grown from a modest distributor into one of the most trusted and preferred suppliers of pipes, fittings, and industrial products. Our journey is built on the foundation of trust, uncompromising quality, and unparalleled customer service.
          </p>
          <p className={styles.storyText}>
            Today, we proudly partner with India's leading brands to ensure our clients—from individual contractors to large-scale industrial builders—receive only the best products for their projects.
          </p>
        </div>
        <div className={`${styles.storyRight} animate-on-scroll`}>
          <div className={styles.storyCard}>
            <p className={styles.storyQuote}>
              "Quality is not an act, it is a habit. We deliver excellence in every product."
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className={styles.visionMissionSection}>
        <div className={`${styles.vmCard} animate-on-scroll`}>
          <div className={styles.vmIcon}>
            <Eye size={40} />
          </div>
          <h3 className={styles.vmTitle}>Our Vision</h3>
          <p className={styles.vmText}>
            To be the most trusted and preferred supplier of pipes, fittings, and industrial products in the region, recognized for our commitment to quality and customer satisfaction.
          </p>
        </div>
        
        <div className={`${styles.vmCard} animate-on-scroll`} style={{ transitionDelay: '100ms' }}>
          <div className={styles.vmIcon}>
            <Target size={40} />
          </div>
          <h3 className={styles.vmTitle}>Our Mission</h3>
          <p className={styles.vmText}>
            To provide genuine, high-quality products from trusted brands at competitive prices, building long-lasting relationships with our customers through reliable service and transparent dealings.
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section className={styles.valuesSection}>
        <div className="animate-on-scroll">
          <h2 className={styles.centerTitle}>Our Core Values</h2>
        </div>
        
        <div className={styles.valuesGrid}>
          <div className={`${styles.valueCard} animate-on-scroll`}>
            <ShieldCheck size={32} className={styles.valueIcon} />
            <h4 className={styles.valueTitle}>Quality</h4>
            <p className={styles.valueText}>We never compromise on the quality of our products and services.</p>
          </div>
          
          <div className={`${styles.valueCard} animate-on-scroll`} style={{ transitionDelay: '100ms' }}>
            <Clock size={32} className={styles.valueIcon} />
            <h4 className={styles.valueTitle}>Reliability</h4>
            <p className={styles.valueText}>Consistent supply and dependable service you can count on.</p>
          </div>
          
          <div className={`${styles.valueCard} animate-on-scroll`} style={{ transitionDelay: '200ms' }}>
            <Smile size={32} className={styles.valueIcon} />
            <h4 className={styles.valueTitle}>Customer Satisfaction</h4>
            <p className={styles.valueText}>Your satisfaction is our ultimate priority in every transaction.</p>
          </div>
          
          <div className={`${styles.valueCard} animate-on-scroll`} style={{ transitionDelay: '300ms' }}>
            <IndianRupee size={32} className={styles.valueIcon} />
            <h4 className={styles.valueTitle}>Honest Pricing</h4>
            <p className={styles.valueText}>Transparent, fair, and highly competitive pricing always.</p>
          </div>
          
          <div className={`${styles.valueCard} animate-on-scroll`} style={{ transitionDelay: '400ms' }}>
            <Handshake size={32} className={styles.valueIcon} />
            <h4 className={styles.valueTitle}>Long-Term Relationships</h4>
            <p className={styles.valueText}>We build lasting partnerships, not just one-time transactions.</p>
          </div>

          <div className={`${styles.valueCard} animate-on-scroll`} style={{ transitionDelay: '400ms' }}>
            <Verified size={32} className={styles.valueIcon} />
            <h4 className={styles.valueTitle}>Genuine Products</h4>
            <p className={styles.valueText}>We supply only genuine company products of best quality.</p>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className={styles.industriesSection}>
        <div className="animate-on-scroll">
          <h2 className={styles.industriesTitle}>Industries We Serve</h2>
        </div>
        
        <div className={styles.industriesGrid}>
          <div className={`${styles.industryCard} animate-on-scroll`}>
            <Building2 size={40} className={styles.industryIcon} />
            <h4 className={styles.industryTitle}>Commercial Construction</h4>
            <p className={styles.industryDesc}>Supplying robust materials for commercial complexes and offices.</p>
          </div>
          
          <div className={`${styles.industryCard} animate-on-scroll`} style={{ transitionDelay: '100ms' }}>
            <Landmark size={40} className={styles.industryIcon} />
            <h4 className={styles.industryTitle}>Infrastructure Projects</h4>
            <p className={styles.industryDesc}>Delivering high-grade pipes and fittings for critical public infrastructure.</p>
          </div>
          
          <div className={`${styles.industryCard} animate-on-scroll`} style={{ transitionDelay: '200ms' }}>
            <Factory size={40} className={styles.industryIcon} />
            <h4 className={styles.industryTitle}>Industrial Projects</h4>
            <p className={styles.industryDesc}>Providing reliable industrial supplies and heavy-duty components.</p>
          </div>
          
          <div className={`${styles.industryCard} animate-on-scroll`} style={{ transitionDelay: '300ms' }}>
            <Building size={40} className={styles.industryIcon} />
            <h4 className={styles.industryTitle}>Government Projects</h4>
            <p className={styles.industryDesc}>Meeting stringent standards required for government developments.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="animate-on-scroll">
          <h2 className={styles.ctaHeading}>Partner with Us</h2>
          <p className={styles.ctaText}>Let’s work together. Straightforward communication, zero headaches, and a supplier that actually provides the best.</p>
          <a href={`mailto:${companyInfo.email}`} className={styles.ctaBtn}>Email Us</a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
