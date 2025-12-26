// src/pages/admin/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaBriefcase, 
  FaRocket, 
  FaGlobe, 
  FaEdit, 
  FaPlus,
  FaExternalLinkAlt 
} from 'react-icons/fa';
import { fetchProfile } from '../../redux/slices/profileSlice';
import { fetchEducation } from '../../redux/slices/educationSlice';
import { fetchExperience } from '../../redux/slices/experienceSlice';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { fetchLanguages } from '../../redux/slices/languageSlice';
import { fetchContactMessages } from '../../redux/slices/contactSlice';
import { FiEdit2, FiExternalLink } from 'react-icons/fi';
import { IoBriefcaseOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { BiStats } from 'react-icons/bi';
import { HiMiniLanguage } from 'react-icons/hi2';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const { items: education } = useSelector((state) => state.education);
  const { items: experience } = useSelector((state) => state.experience);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: languages } = useSelector((state) => state.languages);
  const { messages = [] } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchEducation({ page: 1, limit: 100 }));
    dispatch(fetchExperience({ page: 1, limit: 100 }));
    dispatch(fetchProjects({ page: 1, limit: 100 }));
    dispatch(fetchLanguages());
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

  const stats = [
    {
      title: 'Təhsil',
      count: education.length,
      icon: <FaGraduationCap />,
      color: '#6366f1',
      link: '/admin/education'
    },
    {
      title: 'Təcrübə',
      count: experience.length,
      icon: <IoBriefcaseOutline />,
      color: '#8b5cf6',
      link: '/admin/experience'
    },
    {
      title: 'Proyektlər',
      count: projects.length,
      icon: <FaRocket />,
      color: '#10b981',
      link: '/admin/projects'
    },
    {
      title: 'Dillər',
      count: languages.length,
      icon: <HiMiniLanguage />,
      color: '#3b82f6',
      link: '/admin/languages'
    },
    {
      title: 'Mesajlar',
      count: messages.length,
      icon: <CiMail />,
      color: '#3fbef4ff',
      link: '/admin/messages'
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
          <span>Saytı bax</span>
          <FiExternalLink />
        </Link>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat) => (
          <Link 
            key={stat.title} 
            to={stat.link}
            className="stat-card"
            style={{ '--accent-color': stat.color }}
          >
            <div className="stat-card__icon">{stat.icon}</div>
            <div className="stat-card__content">
              <h3 className="stat-card__count">{stat.count}</h3>
              <p className="stat-card__title">{stat.title}</p>
            </div>
          </Link>
        ))}
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
          </div>
        </div>
      )}

      <div className="dashboard__quick-actions">
        <h2 className="dashboard__section-title">Sürətli Əməliyyatlar</h2>
        <div className="quick-actions">
          <Link to="/admin/profile" className="quick-action">
            <FiEdit2 className="quick-action__icon" />
            <span className="quick-action__text">Profili Redaktə et</span>
          </Link>
          <Link to="/admin/education" className="quick-action">
            <FaPlus className="quick-action__icon" />
            <span className="quick-action__text">Təhsil əlavə et</span>
          </Link>
          <Link to="/admin/experience" className="quick-action">
            <FaPlus className="quick-action__icon" />
            <span className="quick-action__text">Təcrübə əlavə et</span>
          </Link>
          <Link to="/admin/projects" className="quick-action">
            <FaPlus className="quick-action__icon" />
            <span className="quick-action__text">Proyekt əlavə et</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;