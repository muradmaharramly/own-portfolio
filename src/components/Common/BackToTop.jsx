import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { IoIosArrowUp } from 'react-icons/io';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.pageYOffset > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <div
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollToTop()}
        >
          <IoIosArrowUp />
        </div>
      )}
    </>
  );
};

export default BackToTop;
