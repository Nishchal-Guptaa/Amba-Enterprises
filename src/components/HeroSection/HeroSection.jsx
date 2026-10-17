import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import styles from './HeroSection.module.css';
import { companyInfo } from '../../data/data';
import heroImg from '../../assets/GI_and_MS_pipes.png';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Quality Pipes,<br />Fittings &amp; Solutions
          </h1>
          <p className={styles.subtitle}>
            Amba Enterprises is a leading distributor of top-tier plumbing and industrial solutions in Gurugram. From premium GI, MS, and CPVC pipes to specialized fittings and welding rods, we deliver unmatched quality for all your needs.
          </p>
          <div className={styles.actions}>
            <Link to="/products" className={styles.primaryBtn}>
              Explore Products <ArrowRight size={20} />
            </Link>
            <a href={`mailto:${companyInfo.email}`} className={styles.secondaryBtn}>
              Contact Us <Mail size={20} />
            </a>
          </div>
        </div>
        <div className={styles.illustration}>
          <img
            src={heroImg}
            alt="GI and MS pipes stacked in Amba Enterprises warehouse"
            className={styles.heroImg}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
