import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaClock, FaHandshake, FaCheckCircle, FaUsers, FaReact, FaHeart, FaChevronRight } from 'react-icons/fa';
import { BiTimeFive } from 'react-icons/bi';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { fetchExperience } from '../../redux/slices/experienceSlice';
import { fetchEducation } from '../../redux/slices/educationSlice';
import Tag from '../Common/Tag';
import { VscFeedback } from 'react-icons/vsc';
import { GoCheckCircle, GoClock } from 'react-icons/go';
import { BsPersonCheck } from 'react-icons/bs';
import { GrTechnology } from 'react-icons/gr';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { FiHeart, FiX } from 'react-icons/fi';
import { HiCodeBracket } from 'react-icons/hi2';
import { RiChat3Line } from 'react-icons/ri';
import { PiChatCircleText, PiHandshakeLight } from 'react-icons/pi';
import { TbHeartHandshake } from 'react-icons/tb';
import Modal from '../Common/Modal';

const SOFT_SKILLS_KEYWORDS = [
  'Communication', 'Networking', 'Teamwork', 'Team Player', 'Leadership', 'Problem Solving',
  'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity',
  'Work Ethic', 'Interpersonal', 'Management', 'Mentoring', 'Teaching',
  'Public Speaking', 'Collaboration', 'Decision Making', 'Emotional Intelligence',
  'Negotiation', 'Conflict Resolution', 'Active Listening', 'Agile', 'Scrum', 'Kanban',
  'Presentation', 'Analytical', 'Organizational', 'Detail-oriented', 'Attention to Detail',
  'Strategic', 'Planning', 'Research', 'Writing', 'Empathy', 'Flexibility',
  'Self-motivation', 'Self-starter', 'Fast Learner', 'Quick Learner', 'Responsibility',
  'Accountability', 'Patience', 'Open-mindedness'
];

const AboutDetailed = () => {
  const dispatch = useDispatch();
  const { items: projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { items: experience, loading: experienceLoading } = useSelector((state) => state.experience);
  const { items: education, loading: educationLoading } = useSelector((state) => state.education);

  const [techModalOpen, setTechModalOpen] = useState(false);
  const [softModalOpen, setSoftModalOpen] = useState(false);

  useEffect(() => {
    if (!projects.length && !projectsLoading) dispatch(fetchProjects());
    if (!experience.length && !experienceLoading) dispatch(fetchExperience());
    if (!education.length && !educationLoading) dispatch(fetchEducation());
  }, [dispatch, projects.length, experience.length, education.length]);

  // Skill Extraction Logic (replicated from Skills.jsx)
  const { toolsAndTech, softSkills } = useMemo(() => {
    const uniqueTagsMap = new Map();
    const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, '');

    const processTag = (tag) => {
      if (!tag) return;
      const trimmed = tag.trim();
      const normalized = normalize(trimmed);
      
      if (uniqueTagsMap.has(normalized)) return;

      // Explicitly exclude certain technical terms that might partially match soft skills
      if (normalized === 'statemanagement') {
        uniqueTagsMap.set(normalized, { display: trimmed, isSoft: false });
        return;
      }

      let isSoft = false;
      let display = trimmed;

      const matchedKeyword = SOFT_SKILLS_KEYWORDS.find(keyword => {
        const normKeyword = normalize(keyword);
        return normalized === normKeyword || trimmed.toLowerCase().includes(keyword.toLowerCase());
      });

      if (matchedKeyword) {
        isSoft = true;
        if (normalize(matchedKeyword) === normalized) {
          display = matchedKeyword;
        }
      }

      uniqueTagsMap.set(normalized, { display, isSoft });
    };

    education.forEach(item => item.skills?.forEach(s => s.skill_name && processTag(s.skill_name)));
    experience.forEach(item => item.skills?.forEach(s => s.skill_name && processTag(s.skill_name)));
    projects.forEach(item => item.technologies?.forEach(t => t.technology_name && processTag(t.technology_name)));

    const tools = [];
    const soft = [];

    uniqueTagsMap.forEach(({ display, isSoft }) => {
      if (isSoft) soft.push(display);
      else tools.push(display);
    });

    return {
      toolsAndTech: tools.sort((a, b) => a.localeCompare(b)),
      softSkills: soft.sort((a, b) => a.localeCompare(b))
    };
  }, [education, experience, projects]);

  // Calculate Coding Hours
  const codingHours = useMemo(() => {
    const startDate = new Date('2023-10-15'); // Start date for calculation
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const baseHours = 500;
    const hoursPerDay = 2;
    
    return baseHours + (diffDays * hoursPerDay);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="about-detailed"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Left Column */}
      <div className="about-detailed__col">
        {/* Tools & Tech Card */}
        <motion.div 
          className={`bento-card ${toolsAndTech.length > 10 ? 'bento-card--clickable' : ''}`} 
          variants={itemVariants}
          onClick={() => toolsAndTech.length > 10 && setTechModalOpen(true)}
        >
          <div className="bento-card__header">
            <div className="bento-card__icon">
              <GrTechnology />
            </div>
            <h3 className="bento-card__title">Tools & Technologies</h3>
          </div>
          <div className="bento-card__tags">
            {toolsAndTech.length > 0 ? toolsAndTech.slice(0, 10).map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            )) : (
              <span className="skill-tag">Loading...</span>
            )}
            {toolsAndTech.length > 10 && (
              <button className="skill-tag skill-tag--more">
                +{toolsAndTech.length - 10} more <FaChevronRight size={10} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Soft Skills Card */}
        <motion.div 
          className={`bento-card ${softSkills.length > 10 ? 'bento-card--clickable' : ''}`} 
          variants={itemVariants}
          onClick={() => softSkills.length > 10 && setSoftModalOpen(true)}
        >
          <div className="bento-card__header">
            <div className="bento-card__icon">
              <BsPersonCheck />
            </div>
            <h3 className="bento-card__title">Soft Skills</h3>
          </div>
          <div className="bento-card__tags">
            {softSkills.length > 0 ? softSkills.slice(0, 10).map(skill => (
              <span key={skill} className="skill-tag skill-tag--soft">{skill}</span>
            )) : (
              <span className="skill-tag">Loading...</span>
            )}
            {softSkills.length > 10 && (
              <button className="skill-tag skill-tag--soft skill-tag--more">
                +{softSkills.length - 10} more <FaChevronRight size={10} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={techModalOpen} 
        onClose={() => setTechModalOpen(false)} 
        title="Tools & Technologies"
        size="lg"
        className="skills-modal skills-modal--tech"
      >
        <div className="skills-modal-content">
          <div className="bento-card__tags">
            {toolsAndTech.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={softModalOpen} 
        onClose={() => setSoftModalOpen(false)} 
        title="Soft Skills"
        size="lg"
        className="skills-modal skills-modal--soft"
      >
        <div className="skills-modal-content">
          <div className="bento-card__tags">
            {softSkills.map(skill => (
              <span key={skill} className="skill-tag skill-tag--soft">{skill}</span>
            ))}
          </div>
        </div>
      </Modal>

      {/* Right Column */}
      <div className="about-detailed__col">
        <div className="bento-row">
          {/* Coding Hours Card */}
          <motion.div className="bento-card hours-card" variants={itemVariants}>
            <div className="bento-card__header">
              <div className="bento-card__icon">
                <HiCodeBracket />
              </div>
              <h3 className="bento-card__title">Coding Hours</h3>
            </div>
            <div className="bento-card__value">{codingHours.toLocaleString()}</div>
            <p className="bento-card__subtitle">Hands-on coding experience, growing and learning continuously.</p>
          </motion.div>

          {/* Favorite Framework Card */}
          <motion.div className="bento-card framework-card" variants={itemVariants}>
            <div className="bento-card__header">
              <div className="bento-card__icon">
                <FiHeart />
              </div>
              <h3 className="bento-card__title">Favorite</h3>
            </div>
            <div className="framework-display">
              <FaReact className="framework-icon-large" />
              <span className="framework-text">React</span>
            </div>
          </motion.div>
        </div>

        {/* Promise Card */}
        <motion.div className="bento-card promise-card" variants={itemVariants}>
          <div className="bento-card__header">
            <div className="bento-card__icon">
              <VscFeedback />
            </div>
            <h3 className="bento-card__title">My Promise</h3>
          </div>
          <ul className="promise-list">
            <li>
              <GoClock className="promise-icon" />
              <span>I read messages within a maximum of 1 hour.</span>
            </li>
            <li>
              <GoCheckCircle className="promise-icon" />
              <span>I provide 100% feedback via email.</span>
            </li>
            <li>
              <PiChatCircleText className='promise-icon' />
              <span>I can discuss your idea with you.</span>
            </li>
             <li>
              <PiHandshakeLight className='promise-icon' />
              <span>I can collaborate with you on your project.</span>
            </li>
          </ul>
         
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutDetailed;
