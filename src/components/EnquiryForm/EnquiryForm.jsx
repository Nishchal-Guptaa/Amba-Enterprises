import React, { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './EnquiryForm.module.css';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send data to backend here
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
    }, 5000);
  };

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h3>Enquiry Sent Successfully!</h3>
        <p>Thank you for reaching out. Our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="John Doe"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>
      
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="john@example.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="interest" className={styles.label}>Product Interest *</label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="" disabled>Select a product</option>
            <option value="Pipes">Pipes (GI, MS, PVC, etc.)</option>
            <option value="Fittings">Fittings</option>
            <option value="Welding Rods">Mangalam Welding Rods</option>
            <option value="Solvents">Solvents</option>
            <option value="Valves">Valves</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Your Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Tell us about your requirements..."
          rows="5"
          required
        ></textarea>
      </div>

      <button type="submit" className={styles.submitBtn}>
        <span>Send Enquiry</span>
        <Send size={18} />
      </button>
    </form>
  );
};

export default EnquiryForm;
