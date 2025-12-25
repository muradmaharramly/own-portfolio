// ============================================
// components/Home/Experience.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExperience } from '../../redux/slices/experienceSlice';
import { motion } from 'framer-motion';
import { FiCalendar, FiBriefcase, FiClock } from 'react-icons/fi';

const Experience = () => {
  const dispatch = useDispatch();
  const { items: experience, loading } = useSelector((state) => state.experience);
  const [showAll, setShowAll] = useState(false);
  const itemsToShow = showAll ? experience.length : 3;

  useEffect(() => {
    dispatch(fetchExperience());
  }, [dispatch]);

  const formatDate = (date, isCurrent) => {
    if (isCurrent) return 'Present';
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      intern: 'Internship',
      volunteer: 'Volunteer',
      work: 'Work',
    };
    return labels[type] || type;
  };

  const getEmploymentLabel = (type) => {
    const labels = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'self-employed': 'Self Employed',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <section className="experience section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="experience section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Experience</h2>
          <div className="section-divider"></div>
        </motion.div>

        <div className="experience__timeline">
          {experience.slice(0, itemsToShow).map((exp, index) => (
            <motion.div
              key={exp.id}
              className="experience-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="experience-card__marker"></div>

              <div className="experience-card__content">
                {exp.company_logo && (
                  <div className="experience-card__logo">
                    <img src={exp.company_logo} alt={exp.company_name} />
                  </div>
                )}

                <div className="experience-card__header">
                  <h3 className="experience-card__company">{exp.company_name}</h3>
                  <p className="experience-card__position">{exp.position}</p>
                </div>

                <div className="experience-card__meta">
                  <span className="experience-card__badge">
                    <FiBriefcase />
                    {getTypeLabel(exp.experience_type)}
                  </span>
                  <span className="experience-card__badge">
                    <FiClock />
                    {getEmploymentLabel(exp.employment_type)}
                  </span>
                </div>

                <div className="experience-card__date">
                  <FiCalendar />
                  <span>
                    {formatDate(exp.start_date)} -{' '}
                    {formatDate(exp.end_date, exp.is_current)}
                  </span>
                </div>

                {exp.description && (
                  <p className="experience-card__description">{exp.description}</p>
                )}

                {exp.skills && exp.skills.length > 0 && (
                  <div className="experience-card__skills">
                    {exp.skills.map((skill) => (
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

        {experience.length > 3 && (
          <motion.div
            className="experience__load-more"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-secondary"
            >
              {showAll ? 'Show Less' : `Load More (${experience.length - 3})`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experience;