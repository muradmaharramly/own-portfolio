import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Footer from '../components/Layout/Footer';
import { GoHome, GoHomeFill } from 'react-icons/go';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <main>
        <div className="not-found">
          <motion.div 
            className="not-found__content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          >
            <h1 className="not-found__code">404</h1>
            <h2 className="not-found__title">Page Not Found</h2>
            <p className="not-found__text">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="not-found__button">
              <GoHomeFill /> Back to Home
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
