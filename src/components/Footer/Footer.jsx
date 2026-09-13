import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { companyInfo } from "../../data/data";
import styles from "./Footer.module.css";
import AmbaLogo from "../../assets/Amba Logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const info = companyInfo || {
    name: "Amba Enterprises",
    description:
      "Leading provider of Pipes, Fittings, and Industrial Solutions.",
    address: "Bada Bazar, Basai Road, Gurugram, Haryana - 122001",
    phone: "+91 9811103866",
    email: "ajay_amba@ymail.com",
    businessHours: "9:30 AM to 7:30 PM (Mon-Sat)",
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.grid}>
          {/* Column 1 */}
          <div className={styles.column}>
            <div className={styles.logoContainer}>
              <img
                src={AmbaLogo}
                alt="Amba Enterprises logo"
                className={styles.logoMark}
              />
              <span className={styles.logoText}>
                {info.name || "Amba Enterprises"}
              </span>
            </div>
            <p className={styles.description}>
              {info.description ||
                "Quality Pipes, Fittings, and Industrial Solutions for all your needs."}
            </p>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/amba__enterprises/" aria-label="Instagram" className={styles.socialIcon} target="_blank">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* <a href="#" aria-label="Facebook" className={styles.socialIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a> */}
              <a href="https://www.linkedin.com/in/amba-enterprises-5764418b/" aria-label="LinkedIn" className={styles.socialIcon} target="_blank">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/brands">Brands</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Products */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Our Products</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/products">Pipes</Link>
              </li>
              <li>
                <Link to="/products">Fittings</Link>
              </li>
              <li>
                <Link to="/products">Welding Rods</Link>
              </li>
              <li>
                <Link to="/products">Solvents</Link>
              </li>
              <li>
                <Link to="/products">Valves</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contact Info</h3>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>
                  {info.address ||
                    "Bada Bazar, Basai Road, Gurugram, Haryana - 122001"}
                </span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <span>{info.phone || "+91 9811103866"}</span>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <span>{info.email || "ajay_amba@ymail.com"}</span>
              </li>
              <li>
                <Clock size={18} className={styles.contactIcon} />
                <span>
                  {info.businessHours || "9:30 AM to 7:30 PM (Mon-Sat)"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p>
            Copyright © {currentYear} {info.name || "Amba Enterprises"}. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
