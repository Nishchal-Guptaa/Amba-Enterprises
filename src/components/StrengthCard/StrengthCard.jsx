import React from 'react';
import styles from './StrengthCard.module.css';

const StrengthCard = ({ strength, icon: iconProp, title: titleProp, description: descProp, index = 0 }) => {
  const Icon = iconProp || strength?.icon;
  const title = titleProp || strength?.title;
  const description = descProp || strength?.description;

  return (
    <div 
      className={styles.strengthCard} 
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className={styles.iconWrapper}>
        {Icon && <Icon size={28} className={styles.icon} />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default StrengthCard;
