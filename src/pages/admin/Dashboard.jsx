// src/pages/admin/Dashboard.jsx
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap,
  FaBriefcase,
  FaRocket,
  FaGlobe,
  FaEdit,
  FaPlus,
  FaExternalLinkAlt,
  FaTools,
  FaUsers,
  FaShareAlt,
  FaRegEye
} from 'react-icons/fa';
import { fetchProfile } from '../../redux/slices/profileSlice';
import { fetchEducation } from '../../redux/slices/educationSlice';
import { fetchExperience } from '../../redux/slices/experienceSlice';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { fetchLanguages } from '../../redux/slices/languageSlice';
import { fetchContactMessages, fetchContactInfo } from '../../redux/slices/contactSlice';
import { fetchSocialMedia } from '../../redux/slices/socialMediaSlice';
import { FiEdit2, FiExternalLink, FiPhone } from 'react-icons/fi';
import { IoBriefcaseOutline, IoRocketOutline, IoShareSocialOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { BiStats } from 'react-icons/bi';
import { HiMiniLanguage } from 'react-icons/hi2';
import { GrTechnology } from 'react-icons/gr';
import { BsPersonCheck } from 'react-icons/bs';
import { PiGraduationCap } from 'react-icons/pi';
import { LuPhone } from 'react-icons/lu';

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const { items: education } = useSelector((state) => state.education);
  const { items: experience } = useSelector((state) => state.experience);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: languages } = useSelector((state) => state.languages);
  const { items: socialMedia } = useSelector((state) => state.socialMedia);
  const { info: contactInfo, messages = [] } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchEducation({ page: 1, limit: 100 }));
    dispatch(fetchExperience({ page: 1, limit: 100 }));
    dispatch(fetchProjects({ page: 1, limit: 100 }));
    dispatch(fetchLanguages());
    dispatch(fetchSocialMedia());
    dispatch(fetchContactInfo());
    dispatch(fetchContactMessages());
  }, [dispatch]);

  // Calculate stats
  const calculateAverage = (items, type) => {
    if (!items || !items.length) return 0;
    const dates = items.map(i => new Date(i.created_at));
    const minDate = new Date(Math.min(...dates));
    const now = new Date();
    const diffTime = Math.abs(now - minDate);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (type === 'week') {
      const weeks = Math.max(1, diffDays / 7);
      return (items.length / weeks).toFixed(1);
    }
    if (type === 'month') {
      const months = Math.max(1, diffDays / 30);
      return (items.length / months).toFixed(1);
    }
    return 0;
  };

  const avgMessagesPerWeek = calculateAverage(messages, 'week');
  const avgProjectsPerMonth = calculateAverage(projects, 'month');
  const unreadMessages = Array.isArray(messages) ? messages.filter(m => !m.is_read).length : 0;

  // Skill Extraction Logic
  const { toolsCount, softSkillsCount, toolsList, softSkillsList } = useMemo(() => {
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
      toolsCount: tools.length,
      softSkillsCount: soft.length,
      toolsList: tools.sort((a, b) => a.localeCompare(b)),
      softSkillsList: soft.sort((a, b) => a.localeCompare(b))
    };
  }, [education, experience, projects]);

  const stats = [
  {
    title: 'Təhsil',
    count: education.length,
    icon: <PiGraduationCap />,
    color: 'var(--primary)',
    link: '/admin/education',
    action: 'Əlavə et'
  },
  {
    title: 'Təcrübə',
    count: experience.length,
    icon: <IoBriefcaseOutline />,
    color: 'var(--secondary)',
    link: '/admin/experience',
    action: 'Əlavə et'
  },
  {
    title: 'Proyektlər',
    count: projects.length,
    icon: <IoRocketOutline />,
    color: 'var(--accent)',
    link: '/admin/projects',
    action: 'Əlavə et'
  },
  {
    title: 'Dillər',
    count: languages.length,
    icon: <HiMiniLanguage />,
    color: 'var(--primary)',
    link: '/admin/languages',
    action: 'Əlavə et'
  },
  {
    title: 'Sosial Media',
    count: socialMedia?.length || 0,
    icon: <IoShareSocialOutline />,
    color: 'var(--secondary)',
    link: '/admin/social-media',
    action: 'Əlavə et'
  },
  {
    title: 'Əlaqə Məlumatı',
    count: contactInfo ? 3 : 0,
    icon: <LuPhone />,
    color: 'var(--accent)',
    link: '/admin/contact',
    action: 'Düzəlt'
  },
  {
    title: 'Mesajlar',
    count: messages.length,
    icon: <CiMail />,
    color: 'var(--primary)',
    link: '/admin/messages',
    action: 'Bax'
  }
];


  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Xoş gəldiniz, {profile?.full_name || 'Admin'}</p>
        </div>
        <Link to="/" className="dashboard__view-site" target="_blank">
          <span>Sayta bax</span>
          <FiExternalLink />
        </Link>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="stat-card"
            style={{ '--accent-color': stat.color }}
          >
            <Link to={stat.link} className="stat-card__main">
              <div className="stat-card__icon">{stat.icon}</div>
              <div className="stat-card__content">
                <h3 className="stat-card__count">{stat.count}</h3>
                <p className="stat-card__title">{stat.title}</p>
              </div>
            </Link>
            <Link to={stat.link} className="stat-card__action">
              {stat.action === 'Əlavə et' ? (
                <FaPlus />
              ) : stat.action === 'Düzəlt' ? (
                <FiEdit2 />
              ) : (
                <FaRegEye />
              )}

              <span>{stat.action}</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="dashboard__section">
        <h2 className="dashboard__section-title">Tags</h2>
        <div className="dashboard__tags-grid">
          {/* Tools & Technologies */}
          <div className="tag-category-card">
            <div className="tag-category-header">
              <div className="tag-category-icon" style={{ background: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
                <GrTechnology />
              </div>
              <div className="tag-category-info">
                <h3>Alətlər və Texnologiyalar</h3>
                <span className="count">{toolsCount} element</span>
              </div>
            </div>
            <div className="tag-list">
              {toolsList.map(tag => (
                <span key={tag} className="tag-item">{tag}</span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="tag-category-card">
            <div className="tag-category-header">
              <div className="tag-category-icon" style={{ background: 'rgba(var(--secondary-rgb), 0.2)', color: 'var(--secondary)' }}>
                <BsPersonCheck />
              </div>
              <div className="tag-category-info">
                <h3>Yumşaq Bacarıqlar</h3>
                <span className="count">{softSkillsCount} element</span>
              </div>
            </div>
            <div className="tag-list">
              {softSkillsList.map(tag => (
                <span key={tag} className="tag-item tag-item--soft">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {profile && (
        <div className="dashboard__profile">
          <h2 className="dashboard__section-title">Profil Məlumatları</h2>
          <div className="profile-preview">
            {profile.profile_image && (
              <img
                src={profile.profile_image}
                alt={profile.full_name}
                className="profile-preview__image"
              />
            )}
            <div className="profile-preview__content">
              <h3 className="profile-preview__name">{profile.full_name}</h3>
              <p className="profile-preview__headline">{profile.headline}</p>
              <p className="profile-preview__about">{profile.about}</p>
            </div>
            <Link to="/admin/profile" className="btn-icon">
              <FiEdit2 />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;