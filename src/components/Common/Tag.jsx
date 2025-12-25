// src/components/common/Tag.jsx
import React from 'react';
import { IoClose } from 'react-icons/io5';

const Tag = ({ children, variant = 'default', onRemove, className = '' }) => {
  return (
    <span className={`tag tag--${variant} ${className}`}>
      <span className="tag__text">{children}</span>
      {onRemove && (
        <button 
          className="tag__remove" 
          onClick={onRemove}
          type="button"
          aria-label="Remove tag"
        >
          <IoClose size={14} />
        </button>
      )}
    </span>
  );
};

export default Tag;