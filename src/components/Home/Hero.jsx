// ============================================
// components/Home/Hero.jsx
// ============================================

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../redux/slices/profileSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { FiDownload, FiArrowDown } from 'react-icons/fi';

const Hero = () => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.profile);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;
    
    const headlines = [
      profile.headline,
      profile.headline_2,
      profile.headline_3
    ].filter(Boolean);

    if (headlines.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [profile]);

  const headlines = profile ? [
    profile.headline,
    profile.headline_2,
    profile.headline_3
  ].filter(Boolean) : ['Developer'];

  if (headlines.length === 0) headlines.push('Developer');

  const currentHeadline = headlines[currentHeadlineIndex];
  const gradientClass = `gradient-text-${(currentHeadlineIndex % 3) + 1}`;

  const handleDownloadCV = async (e) => {
    e.preventDefault();
    
    // Check if CV exists
    if (!profile?.cv_file) {
      console.warn("No CV file available");
      return;
    }

    try {
      // Fetch the file as a blob to control the filename
      const response = await fetch(profile.cv_file);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link to force download with custom name
      const a = document.createElement('a');
      a.href = url;
      a.download = "MuradMaharramliCV.pdf"; // Custom filename as requested
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: Try to open/download using the direct link with query param
      // This is a safety net if fetch fails (e.g. CORS issues)
      window.open(`${profile.cv_file}?download=MuradMaharramliCV.pdf`, '_blank');
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
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentHeadlineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`gradient-text ${gradientClass}`}
                >
                  {currentHeadline}
                </motion.span>
              </AnimatePresence>
            </motion.h2>

            {profile?.subtitle && (
              <motion.p
                className="hero__static-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                {profile.subtitle}
              </motion.p>
            )}

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {profile?.cv_file && (
                <a 
                  href={`${profile.cv_file}?download=MuradMaharramliCV.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  onClick={handleDownloadCV}
                >
                  <FiDownload />
                  Download CV
                </a>
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
              
              {/* Floating Badge */}
              <motion.div 
                className="hero__badge"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="hero__badge-text">Focused</span>
              </motion.div>
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