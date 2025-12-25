// ============================================
// components/Home/Languages.jsx
// ============================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLanguages } from '../../redux/slices/languageSlice';
import { motion } from 'framer-motion';

const Languages = () => {
  const dispatch = useDispatch();
  const { items: languages, loading } = useSelector((state) => state.languages);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const levelFor = (p) => {
    if (p >= 96) return 'Native';
    if (p >= 86) return 'Fluent';
    if (p >= 61) return 'Advanced';
    if (p >= 41) return 'Intermediate';
    return 'Beginner';
  };
  const levelSlug = (p) => levelFor(p).toLowerCase();
  const sorted = [...languages].sort((a, b) => b.proficiency_percentage - a.proficiency_percentage);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="languages section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  if (languages.length === 0) return null;

  return (
    <section id="languages" className="languages section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Languages</h2>
          <div className="section-divider"></div>
        </motion.div>

        <div className="languages__grid">
          {sorted.map((lang, index) => (
            <motion.div
              key={lang.id}
              className="language-circle"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
            <div className='lang-fl'>
              <div className='info'>
                <div className="language-circle__name">{lang.language_name}</div>
              <div className={`language-circle__level pill level-${levelSlug(lang.proficiency_percentage)}`}>
                {levelFor(lang.proficiency_percentage)}
              </div>
              </div>
              <div className="language-circle__ring">
                <svg className="language-circle__svg" viewBox="0 0 140 140" aria-label={`${lang.language_name} ${lang.proficiency_percentage}%`}>
                  <defs>
                    <linearGradient id={`grad-${lang.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="language-circle__track"
                    cx="70"
                    cy="70"
                    r={radius}
                  />
                  <circle
                    className="language-circle__ticks"
                    cx="70"
                    cy="70"
                    r={radius + 8}
                  />
                  <motion.circle
                    className="language-circle__progress"
                    cx="70"
                    cy="70"
                    r={radius}
                    strokeDasharray={circumference}
                    stroke={`url(#grad-${lang.id})`}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{
                      strokeDashoffset:
                        circumference - (circumference * lang.proficiency_percentage) / 100,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 + index * 0.08, ease: 'easeOut' }}
                  />
                </svg>
                <div className="language-circle__center">
                  <div className="language-circle__percent">{lang.proficiency_percentage}%</div>

                </div>
              </div>
            </div>
              
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Languages;
