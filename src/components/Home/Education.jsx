// ============================================
// components/Home/Education.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEducation } from '../../redux/slices/educationSlice';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin } from 'react-icons/fi';

const Education = () => {
  const dispatch = useDispatch();
  const { items: education, loading } = useSelector((state) => state.education);
  const [showAll, setShowAll] = useState(false);
  const itemsToShow = showAll ? education.length : 3;

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  const formatDate = (date, isOngoing) => {
    if (isOngoing) return 'Present';
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <section className="education section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="education section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Education</h2>
          <div className="section-divider"></div>
        </motion.div>

        <div className="education__grid">
          {education.slice(0, itemsToShow).map((edu, index) => (
            <motion.div
              key={edu.id}
              className="education-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {edu.institution_logo && (
                <div className="education-card__logo">
                  <img src={edu.institution_logo} alt={edu.institution_name} />
                </div>
              )}

              <div className="education-card__content">
                <h3 className="education-card__institution">
                  {edu.institution_name}
                </h3>
                
                <p className="education-card__field">{edu.field_of_study}</p>

                <div className="education-card__date">
                  <FiCalendar />
                  <span>
                    {formatDate(edu.start_date)} -{' '}
                    {formatDate(edu.end_date, edu.is_ongoing)}
                  </span>
                </div>

                {edu.description &&  (
                  <p className="education-card__description">{edu.description}</p>
                )}

                {edu.skills && edu.skills.length > 0 && (
                  <div className="education-card__skills">
                    {edu.skills.map((skill) => (
                      <span key={skill.id} className="skill-tag">
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {education.length > 3 && (
          <motion.div
            className="education__load-more"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-secondary"
            >
              {showAll ? 'Show Less' : `Load More (${education.length - 3})`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Education;