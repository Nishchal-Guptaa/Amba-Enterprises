import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const phoneNumber = '919811103866';
  const message = encodeURIComponent('Hello, I would like to inquire about your products.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className={styles.container}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
      <span className={styles.tooltip}>Chat with us</span>
    </div>
  );
};

export default WhatsAppButton;
