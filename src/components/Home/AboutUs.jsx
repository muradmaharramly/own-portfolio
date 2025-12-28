import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlineDownload } from 'react-icons/hi';
import AvatarComp from '../../assets/images/my-avatar-comp.png';

const About = () => {
  const { data: profile } = useSelector((state) => state.profile);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, type: "spring", bounce: 0.4 }
    }
  };

  return (
    <section id="about" className="about section">
      <div className="container">
        <motion.div 
          className="about__wrapper"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Image Column */}
          <div className="about__image-col">
            <motion.div className="about__image-container" variants={imageVariants}>
              <div className="about__image-backdrop"></div>
              {profile?.profile_image ? (
                <img 
                  src={AvatarComp} 
                  alt={profile.full_name || 'Profile'} 
                  className="about__image"
                />
              ) : (
                <div className="about__image-placeholder">
                  <span>{profile?.full_name?.[0] || 'A'}</span>
                </div>
              )}
              
              {/* Floating Badge */}
              <motion.div 
                className="about__badge"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="about__badge-text">Open to Work</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Content Column */}
          <div className="about__content-col">
            <motion.div className="about__header" variants={itemVariants}>
              <h2 className="section-title">About Me</h2>
            </motion.div>

            <motion.div className="about__text" variants={itemVariants}>
              <p>{profile?.about || 'I am a passionate developer dedicated to building high-quality applications.'}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="about__decoration about__decoration--1"></div>
      <div className="about__decoration about__decoration--2"></div>
    </section>
  );
};

export default About;
