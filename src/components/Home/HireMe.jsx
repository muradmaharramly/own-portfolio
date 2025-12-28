import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineChatAlt2 } from 'react-icons/hi';

const HireMe = () => {
  return (
    <section className="hire-me section">
      <div className="container">
        <motion.div 
          className="hire-me__content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="hire-me__icon-wrapper">
            <HiOutlineClock className="hire-me__icon" />
          </div>
          
          <h2 className="hire-me__title">
            Interested in working with me?
          </h2>
          
          <p className="hire-me__text">
            I read your messages within <span className="highlight">1 hour</span> and guarantee <span className="highlight">100% feedback</span>.
          </p>

          <motion.div 
            className="hire-me__actions"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="#contact" className="btn btn-primary btn-sm">
              <span>Contact Me</span>
              <HiOutlineChatAlt2 />
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="hire-me__bg-decoration"></div>
    </section>
  );
};

export default HireMe;
