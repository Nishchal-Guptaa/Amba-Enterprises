import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './LightboxModal.module.css';

const LightboxModal = ({ isOpen, onClose, imageSrc, caption, onPrev, onNext }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && onPrev) {
      onPrev();
    } else if (e.key === 'ArrowRight' && onNext) {
      onNext();
    }
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <X size={32} />
      </button>
      
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {onPrev && (
          <button className={styles.navBtn} onClick={onPrev} aria-label="Previous">
            <ChevronLeft size={36} />
          </button>
        )}
        
        <div className={styles.imageContainer}>
          <img src={imageSrc} alt={caption || 'Enlarged view'} className={styles.image} />
          {caption && <p className={styles.caption}>{caption}</p>}
        </div>

        {onNext && (
          <button className={styles.navBtn} onClick={onNext} aria-label="Next">
            <ChevronRight size={36} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
