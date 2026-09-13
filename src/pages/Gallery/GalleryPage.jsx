import React, { useState } from 'react';
import { Camera, Package, Warehouse, Building } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import LightboxModal from '../../components/LightboxModal/LightboxModal';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { galleryImages } from '../../data/data';
import styles from './GalleryPage.module.css';

export default function GalleryPage() {
  useScrollAnimation();
  const [lightboxData, setLightboxData] = useState(null);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'products': return <Package size={32} />;
      case 'warehouse': return <Warehouse size={32} />;
      case 'office': return <Building size={32} />;
      default: return <Camera size={32} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'products': return 'linear-gradient(135deg, #1A3A5C, #0B1D3A)';
      case 'warehouse': return 'linear-gradient(135deg, #D97706, #B45309)';
      case 'office': return 'linear-gradient(135deg, #374151, #1F2937)';
      default: return 'linear-gradient(135deg, #6B7280, #4B5563)';
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHero 
        title="Gallery" 
        subtitle="A glimpse of our products, warehouse & operations" 
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Gallery' }]} 
      />

      <div className={styles.container}>
        <div className={styles.galleryGrid}>
          {galleryImages.map((image, index) => (
            <div 
              key={image.id}
              className={`animate-on-scroll ${styles.galleryItem}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setLightboxData(image)}
            >
              <div 
                className={styles.imagePlaceholder}
                style={{ background: getCategoryColor(image.category) }}
              >
                  {image.src && (
                    <img
                      src={image.src}
                      alt={image.alt || image.title}
                      className={styles.galleryImage}
                    />
                  )}
                <div className={styles.placeholderContent}>
                  {getCategoryIcon(image.category)}
                  <span className={styles.categoryBadge}>
                    {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {galleryImages.length === 0 && (
          <div className={styles.emptyState}>
            <Camera size={48} className={styles.emptyIcon} />
            <h3>No images found</h3>
          </div>
        )}
      </div>

      {lightboxData && (
        <LightboxModal 
          isOpen={!!lightboxData}
          onClose={() => setLightboxData(null)}
          imageSrc={lightboxData.src}
        />
      )}
    </div>
  );
}
