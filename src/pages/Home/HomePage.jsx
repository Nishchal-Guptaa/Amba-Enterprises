import React from "react";
import styles from "./HomePage.module.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { strengths, companyInfo } from "../../data/data";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import HeroSection from "../../components/HeroSection/HeroSection";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import StrengthCard from "../../components/StrengthCard/StrengthCard";
import unikLogo from "../../assets/unik_logo.jpg";
import astralLogo from "../../assets/astral_logo.png";
import supremeLogo from "../../assets/SupremeLogo.png"
import solido_logo from "../../assets/Solido_Logo.png";
import zolotoLogo from "../../assets/zoloto_logo.png";
import vsLogo from "../../assets/VS_logo.png";
import mangalamLogo from "../../assets/mangalam_logo.png";
import jindalHissar from "../../assets/jindal_hissar.jpg";

const featuredProducts = [
  {
    id: "gims-pipes",
    name: "GI Fittings",
    brand: "Unik",
    description: "Leading Manufacturer of Malleable Iron Galvanized Pipe Fittings in India",
    image: unikLogo,
    website: "https://www.unikpipe.com/",
    popularity: 98,
    newest: 6,
  },
  {
    id: "pvc-fittings",
    name: "CPVC Pipes and Fittings",
    brand: "Astral",
    description: "CPVC hot and cold water plumbing system",
    image: astralLogo,
    website: "https://www.astralpipes.com/",
    popularity: 91,
    newest: 5,
  },
  {
    id: "pipe-fittings",
    name: "Plastic Pipes and Fittings",
    brand: "Supreme",
    description: "A pioneer in plastic piping systems in India",
    image: supremeLogo,
    website: "https://www.supreme.co.in/",
    popularity: 97,
    newest: 4,
  },
  {
    id: "cpvc-solutions",
    name: "Metal Piping Solutions",
    brand: "Jindal Hissar",
    description: "Galvanised & Black pipes for water, gas & air",
    image: jindalHissar,
    website: "https://jindalhissar.com/",
    popularity: 86,
    newest: 3,
  },
  {
    id: "mangalam-rods",
    name: "Mangalam Welding Rods",
    brand: "Mangalam",
    description: "Consistent electrodes for clean, dependable welds.",
    image: mangalamLogo,
    website: "https://mangalamindia.in/?srsltid=AU7gw4V1rVV5NxeFVe-FZdmBfxTMHfY8HdftH4xQg-uvPhg2IyGR8DvZ",
    popularity: 89,
    newest: 2,
  },
  {
    id: "solido-products",
    name: "L&T-SuFin Welding Rods",
    brand: "Solido",
    description: "Consistent electrodes for dependable, quality welds.",
    image: solido_logo,
    website: "https://lntsufin.com/",
    popularity: 93,
    newest: 1,
  },
  {
    id: "zoloto-valves",
    name: "Zoloto Valves",
    brand: "Zoloto",
    description: "Trusted, precision-engineered industrial valves.",
    image: zolotoLogo,
    website: "https://www.zolotovalves.com/",
    popularity: 93,
    newest: 1,
  },
  {
    id: "vs-fittings",
    name: "VS Forged Fittings",
    brand: "VS",
    description: "Manufacturing Top of the Line MS steel pipe fittings for high durability.",
    image: vsLogo,
    website: "https://www.vsfittings.com/",
    popularity: 93,
    newest: 1,
  },
];

const HomePage = () => {
  useScrollAnimation();

  return (
    <div className={styles.homePage}>
      <HeroSection />

      <section className={styles.productsSection}>
        <ProductGallery products={featuredProducts} />
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyUsSection}>
        <div className="animate-on-scroll">
          <SectionTitle title="Why Choose Amba Enterprises" light={true} />
        </div>

        <div className={styles.whyUsGrid}>
          {strengths.map((strength, index) => (
            <div
              key={strength.id || index}
              className="animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}>
              <StrengthCard strength={strength} />
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry CTA Section */}
      <section className={styles.ctaSection}>
        <div className="animate-on-scroll">
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaSubtitle}>
            Contact us for the best prices on pipes, fittings, and industrial
            products.
          </p>
          <div className={styles.ctaButtons}>
            <a href={`mailto:${companyInfo.email}`} className={styles.ctaBtn}>
              Email Us
            </a>
            <a
              href={`tel:${Array.isArray(companyInfo.phones) ? companyInfo.phones[0] : Array.isArray(companyInfo.phone) ? companyInfo.phone[0] : companyInfo.phone || ""}`}
              className={styles.ctaBtnOutline}>
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
