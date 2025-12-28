import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchEducation } from '../../redux/slices/educationSlice';
import { fetchExperience } from '../../redux/slices/experienceSlice';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import Tag from '../Common/Tag';

// List of common soft skills to filter against
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

const MarqueeRow = ({ items, direction = 'left', speed = 40, variant = 'primary' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="skills__marquee">
      <motion.div
        className="skills__marquee-content"
        initial={{ x: direction === 'left' ? 0 : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : 0 }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {/* Render items twice for seamless loop */}
        {items.map((skill, index) => (
          <div key={`original-${index}`} className="skills__tag-wrapper">
            <Tag variant={variant}>{skill}</Tag>
          </div>
        ))}
        {items.map((skill, index) => (
          <div key={`duplicate-${index}`} className="skills__tag-wrapper">
            <Tag variant={variant}>{skill}</Tag>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Skills = () => {
  const dispatch = useDispatch();
  const { items: educationItems } = useSelector((state) => state.education);
  const { items: experienceItems } = useSelector((state) => state.experience);
  const { items: projectItems } = useSelector((state) => state.projects);

  useEffect(() => {
    if (!educationItems.length) dispatch(fetchEducation());
    if (!experienceItems.length) dispatch(fetchExperience());
    if (!projectItems.length) dispatch(fetchProjects());
  }, [dispatch, educationItems.length, experienceItems.length, projectItems.length]);

  const { toolsAndTech, softSkills } = useMemo(() => {
    const uniqueTagsMap = new Map();
    const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, '');

    const processTag = (tag) => {
      if (!tag) return;
      const trimmed = tag.trim();
      const normalized = normalize(trimmed);
      
      if (uniqueTagsMap.has(normalized)) return;

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

    // Collect tags
    educationItems.forEach(item => item.skills?.forEach(s => s.skill_name && processTag(s.skill_name)));
    experienceItems.forEach(item => item.skills?.forEach(s => s.skill_name && processTag(s.skill_name)));
    projectItems.forEach(item => item.technologies?.forEach(t => t.technology_name && processTag(t.technology_name)));

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
  }, [educationItems, experienceItems, projectItems]);

  // Split tools into multiple rows if there are many
  const toolsRows = useMemo(() => {
    if (toolsAndTech.length <= 10) return [toolsAndTech];
    const mid = Math.ceil(toolsAndTech.length / 2);
    return [toolsAndTech.slice(0, mid), toolsAndTech.slice(mid)];
  }, [toolsAndTech]);

  if (toolsAndTech.length === 0 && softSkills.length === 0) return null;

  return (
    <section id="skills" className="skills section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Overview of my technical expertise and professional capabilities.
          </p>
        </motion.div>

        <div className="skills__container">
          {toolsAndTech.length > 0 && (
            <motion.div 
              className="skills__card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="skills__card-title">Tools & Technologies</h3>
              <div className="skills__card-content">
                {toolsRows.map((row, index) => (
                  <MarqueeRow 
                    key={`tools-row-${index}`} 
                    items={row} 
                    direction={index % 2 === 0 ? 'left' : 'right'} 
                    variant="primary"
                    speed={50 + (index * 5)} 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {softSkills.length > 0 && (
            <motion.div 
              className="skills__card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="skills__card-title">Soft Skills</h3>
              <div className="skills__card-content">
                <MarqueeRow 
                  items={softSkills} 
                  direction="left" 
                  variant="secondary" 
                  speed={45}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
