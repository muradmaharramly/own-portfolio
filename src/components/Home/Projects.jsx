// ============================================
// components/Home/Projects.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';

const Projects = () => {
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector((state) => state.projects);
  const [showAll, setShowAll] = useState(false);
  const itemsToShow = showAll ? projects.length : 3;

  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  if (loading) {
    return (
      <section className="projects section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-divider"></div>
        </motion.div>

        <div className="projects__grid">
          {projects.slice(0, itemsToShow).map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="project-card__image">
                {project.project_image ? (
                  <img src={project.project_image} alt={project.project_name} />
                ) : (
                  <div className="project-card__placeholder">
                    <FiFolder />
                  </div>
                )}
                <div className="project-card__overlay">
                  <div className="project-card__links btn">
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                      >
                        <FiGithub />
                      </a>
                    )}
                    {project.live_url && (
                      <a 
                        href={project.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Live Demo"
                      >
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="project-card__content">
                <h3 className="project-card__project_name">{project.project_name}</h3>
                <p className="project-card__description">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-card__tech">
                    {project.technologies.map((tech) => (
                      <span key={tech.id} className="tech-tag">
                        {tech.technology_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length > 3 && (
          <div className="projects__actions">
            <button 
              className="btn-primary"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'View All Projects'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
