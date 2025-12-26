// ============================================
// components/Home/About.jsx
// ============================================

import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const About = () => {
  const { data: profile } = useSelector((state) => state.profile);

  return (
    <section id="about" className="about section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          <div className="section-divider"></div>
        </motion.div>

        <motion.div
          className="about__content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="about__card">
            <span className="about__accent"></span>
            <div className="about__text">
              <p>{profile?.about || 'No information available'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
