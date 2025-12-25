// src/components/common/LoadMore.jsx
import React from 'react';

const LoadMore = ({ onClick, loading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="load-more">
      <button 
        className="load-more__btn" 
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            <span>Yüklənir...</span>
          </>
        ) : (
          <>
            <span>Daha çox</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default LoadMore;