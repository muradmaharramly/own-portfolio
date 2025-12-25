// ============================================
// components/Home/Hero.jsx
// ============================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowDown } from 'react-icons/fi';

const Hero = () => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const downloadCV = () => {
    if (profile?.cv_url) {
      window.open(profile.cv_url, '_blank');
    }
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero__content">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="hero__title "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hi, I'm <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Me'}</span>
              
            </motion.h1>

            <motion.h2
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span>
                {profile?.headline || 'Developer'}
              </span>
            </motion.h2>

            <motion.p
              className="hero__description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {profile?.about?.substring(0, 150) || 
                'Passionate about creating beautiful and functional web experiences'}
              {profile?.about && profile.about.length > 150 && '...'}
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {profile?.cv_file && (
                <button onClick={downloadCV} className="btn-primary">
                  <FiDownload />
                  Download CV
                </button>
              )}
              <a href="#contact" className="btn-secondary hero-btn">
                Get In Touch
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero__image-container">
              {profile?.profile_image ? (
                <img src={profile.profile_image} alt="Profile" />
              ) : (
                <div className="hero__image-placeholder">
                  <span>{profile?.headline?.[0] || 'M'}</span>
                </div>
              )}
              <div className="hero__image-decoration"></div>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <FiArrowDown />
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;