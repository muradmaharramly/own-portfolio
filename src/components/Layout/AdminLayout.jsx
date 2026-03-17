// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaChartBar,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaRocket,
  FaGlobe,
  FaShareAlt,
  FaEnvelope,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaPalette
} from 'react-icons/fa';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { signOut } from '../../redux/slices/authSlice';
import { IoMdLogOut } from 'react-icons/io';
import { FiMoon, FiSun, FiUser, FiDownload, FiMenu, FiX, FiBell, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiOutlineChartBar } from 'react-icons/hi';
import { PiGraduationCap } from 'react-icons/pi';
import { IoBriefcaseOutline, IoRocketOutline, IoShareSocialOutline } from 'react-icons/io5';
import { HiMiniLanguage } from 'react-icons/hi2';
import { CiMail } from 'react-icons/ci';
import { LuPhone, LuQrCode } from 'react-icons/lu';
import { fetchContactMessages, markAllMessagesAsRead, fetchContactInfo } from '../../redux/slices/contactSlice';
import { fetchEducation } from '../../redux/slices/educationSlice';
import { fetchExperience } from '../../redux/slices/experienceSlice';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { fetchLanguages } from '../../redux/slices/languageSlice';
import { fetchSocialMedia } from '../../redux/slices/socialMediaSlice';
import { fetchProfile } from '../../redux/slices/profileSlice';
import Logo from '../../assets/images/MM-Logo.png';
import { VscSymbolColor } from 'react-icons/vsc';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { messages = [] } = useSelector((state) => state.contact);
  const education = useSelector((state) => state.education.items || []);
  const experience = useSelector((state) => state.experience.items || []);
  const projects = useSelector((state) => state.projects.items || []);
  const languages = useSelector((state) => state.languages.items || []);
  const socialMedia = useSelector((state) => state.socialMedia.items || []);
  const contactInfo = useSelector((state) => state.contact.info);
  const profileData = useSelector((state) => state.profile.data);

  const unreadCount = Array.isArray(messages) ? messages.filter(m => !m.is_read).length : 0;

  React.useEffect(() => {
    dispatch(fetchContactMessages());
    dispatch(fetchEducation());
    dispatch(fetchExperience());
    dispatch(fetchProjects());
    dispatch(fetchLanguages());
    dispatch(fetchSocialMedia());
    dispatch(fetchContactInfo());
    dispatch(fetchProfile());
  }, [dispatch]);



  const handleLogout = () => {
    dispatch(signOut());
    navigate('/admin/login');
  };

  const handleMarkAllAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (unreadCount > 0) {
      dispatch(markAllMessagesAsRead());
      toast.success('Bütün mesajlar oxunmuş kimi işarələndi');
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const sec = Math.floor((now - date) / 1000);
    if (sec < 60) return 'İndi';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} dəq əvvəl`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} saat əvvəl`;
    const d = Math.floor(h / 24);
    return `${d} gün əvvəl`;
  };

  const recentMessages = (messages || []).slice(0, 6);

  const menuItems = [
    { path: '/admin', icon: <HiOutlineChartBar />, label: 'İdarə Paneli', end: true },
    { path: '/admin/profile', icon: <FiUser />, label: 'Profil' },
    { path: '/admin/education', icon: <PiGraduationCap />, label: 'Təhsil' },
    { path: '/admin/experience', icon: <IoBriefcaseOutline />, label: 'Təcrübə' },
    { path: '/admin/projects', icon: <IoRocketOutline />, label: 'Proyektlər' },
    { path: '/admin/languages', icon: <HiMiniLanguage />, label: 'Dillər' },
    { path: '/admin/social-media', icon: <IoShareSocialOutline />, label: 'Sosial Media' },
    { path: '/admin/contact', icon: <LuPhone />, label: 'Əlaqə' },
    { path: '/admin/messages', icon: <CiMail />, label: 'Mesajlar', badge: unreadCount },
    { path: '/admin/qr', icon: <LuQrCode />, label: 'QR' },
    { path: '/admin/design', icon: <VscSymbolColor />, label: 'Dizayn' },
  ];

  const getFilteredSearchResults = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results = [];

    // 1. Search in menu items (Pages)
    menuItems.forEach(item => {
      if (item.label.toLowerCase().includes(query)) {
        let color = 'var(--primary)';
        if (item.path.includes('experience') || item.path.includes('social-media')) color = 'var(--secondary)';
        if (item.path.includes('projects') || item.path.includes('contact')) color = 'var(--accent)';
        
        results.push({ 
          ...item, 
          type: 'page', 
          sublabel: 'Səhifə',
          color
        });
      }
    });

    // 2. Search in Education
    education.forEach(edu => {
      if (edu.institution_name?.toLowerCase().includes(query) || 
          edu.degree?.toLowerCase().includes(query) ||
          edu.description?.toLowerCase().includes(query)) {
        results.push({
          path: '/admin/education',
          icon: <PiGraduationCap />,
          label: edu.institution_name,
          sublabel: edu.degree,
          type: 'education',
          color: 'var(--primary)'
        });
      }
    });

    // 3. Search in Experience
    experience.forEach(exp => {
      if (exp.company_name?.toLowerCase().includes(query) || 
          exp.position?.toLowerCase().includes(query) ||
          exp.description?.toLowerCase().includes(query)) {
        results.push({
          path: '/admin/experience',
          icon: <IoBriefcaseOutline />,
          label: exp.company_name,
          sublabel: exp.position,
          type: 'experience',
          color: 'var(--secondary)'
        });
      }
    });

    // 4. Search in Projects
    projects.forEach(proj => {
      if (proj.project_name?.toLowerCase().includes(query) || 
          proj.description?.toLowerCase().includes(query)) {
        const techs = proj.technologies?.map(t => t.technology_name).join(', ');
        results.push({
          path: '/admin/projects',
          icon: <IoRocketOutline />,
          label: proj.project_name,
          sublabel: techs ? `Texnologiyalar: ${techs}` : 'Proyekt',
          type: 'project',
          meta: proj.category || proj.status,
          color: 'var(--accent)'
        });
      }
    });

    // 5. Search in Languages
    languages.forEach(lang => {
      if (lang.language_name?.toLowerCase().includes(query)) {
        results.push({
          path: '/admin/languages',
          icon: <HiMiniLanguage />,
          label: lang.language_name,
          sublabel: 'Dil bacarığı',
          type: 'language',
          color: 'var(--primary)'
        });
      }
    });

    // 6. Search in Social Media
    socialMedia.forEach(social => {
      if (social.platform_name?.toLowerCase().includes(query)) {
        results.push({
          path: '/admin/social-media',
          icon: <IoShareSocialOutline />,
          label: social.platform_name,
          sublabel: 'Sosial Media',
          type: 'social',
          color: 'var(--secondary)'
        });
      }
    });

    // 7. Search in Profile/Contact
    if (profileData?.full_name?.toLowerCase().includes(query) || 
        profileData?.headline?.toLowerCase().includes(query)) {
      results.push({
        path: '/admin/profile',
        icon: <FiUser />,
        label: profileData.full_name,
        sublabel: 'Profil',
        type: 'profile',
        color: 'var(--primary)'
      });
    }

    if (contactInfo?.email?.toLowerCase().includes(query) || 
        contactInfo?.phone?.toLowerCase().includes(query)) {
      results.push({
        path: '/admin/contact',
        icon: <LuPhone />,
        label: contactInfo.email || contactInfo.phone,
        sublabel: 'Əlaqə məlumatı',
        type: 'contact',
        color: 'var(--accent)'
      });
    }

    return results.slice(0, 8); // Limit results
  };

  const filteredSearchResults = getFilteredSearchResults();

  return (
    <div className={`admin-layout ${isCollapsed ? 'admin-layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''} ${isCollapsed ? 'admin-sidebar--collapsed' : ''}`}>
        <div className="admin-sidebar__header">
          {!isCollapsed && <h2 className="admin-sidebar__logo">Admin Panel</h2>}
          <div className="admin-sidebar__controls">
            <div
              className="admin-sidebar__toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </div>
            <div
              className="admin-sidebar__close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX/>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              <span className="admin-sidebar__label">{item.label}</span>
              {item.badge > 0 && (
                <span className="admin-sidebar__badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>


      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div
            className="admin-topbar__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </div>

          

          <div className="admin-topbar__actions">

            <Link to="/admin/profile" className="admin-topbar__user">
              <div className="admin-topbar__user-avatar">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span className="admin-topbar__user-name">{user?.email}</span>
            </Link>
            <div className="admin-topbar__search">
            <div className={`admin-topbar__search-container ${isSearchFocused ? 'admin-topbar__search-container--focused' : ''}`}>
              <FiSearch className="admin-topbar__search-icon" />
              <input
                type="text"
                placeholder="Axtar (Təhsil, Təcrübə, Proyektlər...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="admin-topbar__search-input"
              />
              {isSearchFocused && filteredSearchResults.length > 0 && (
                <div className="admin-topbar__search-results">
                  {filteredSearchResults.map((result, index) => (
                    <Link
                      key={`${result.path}-${index}`}
                      to={result.path}
                      className="admin-topbar__search-item"
                      style={{ '--accent-color': result.color }}
                      onClick={() => setSearchQuery('')}
                    >
                      <span className="admin-topbar__search-item-icon">{result.icon}</span>
                      <div className="admin-topbar__search-item-content">
                        <div className="admin-topbar__search-item-header">
                          <span className="admin-topbar__search-item-label">{result.label}</span>
                          {result.meta && <span className="admin-topbar__search-item-meta">{result.meta}</span>}
                        </div>
                        <span className="admin-topbar__search-item-sublabel">{result.sublabel}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
            <div className="admin-topbar__ending">
              <div
                className="admin-topbar__notifications"
                onMouseEnter={() => setNotificationsOpen(true)}
                onMouseLeave={() => setNotificationsOpen(false)}
              >
                <Link to="/admin/messages" className="admin-topbar__notifications-btn" aria-label="Bildirişlər">
                  <FiBell />
                  {unreadCount > 0 && (
                    <span className="admin-topbar__notifications-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </Link>
                {notificationsOpen && (
                  <div className="admin-topbar__notifications-banner">
                    <div className="admin-topbar__notifications-header">
                      <h3 className="admin-topbar__notifications-title">Bildirişlər</h3>
                      {unreadCount > 0 && (
                        <button type="button" className="admin-topbar__notifications-markall" onClick={handleMarkAllAsRead}>
                          Hamısını oxunmuş işarələ
                        </button>
                      )}
                    </div>
                    <div className="admin-topbar__notifications-list">
                      {recentMessages.length === 0 ? (
                        <p className="admin-topbar__notifications-empty">Mesaj yoxdur</p>
                      ) : (
                        recentMessages.map((msg) => (
                          <Link
                            key={msg.id}
                            to="/admin/messages"
                            className={`admin-topbar__notifications-item ${!msg.is_read ? 'admin-topbar__notifications-item--unread' : ''}`}
                          >
                            <div className="admin-topbar__notifications-item-avatar">
                              {msg.sender_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="admin-topbar__notifications-item-body">
                              <span className="admin-topbar__notifications-item-name">{msg.sender_name}</span>
                              <span className="admin-topbar__notifications-item-preview">
                                {msg.message?.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message}
                              </span>
                              <span className="admin-topbar__notifications-item-time">{formatTimeAgo(msg.created_at)}</span>
                            </div>
                            {!msg.is_read && <span className="admin-topbar__notifications-item-dot" />}
                          </Link>
                        ))
                      )}
                    </div>
                    {recentMessages.length > 0 && (
                      <Link to="/admin/messages" className="admin-topbar__notifications-footer">
                        Bütün mesajlara bax
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div
                className="admin-topbar__theme"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle theme"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch(toggleTheme())}
              >
                {mode === 'dark' ? <FiSun /> : <FiMoon />}
              </div>
              <button
                className="admin-topbar__logout"
                onClick={handleLogout}
              >
                <span className="admin-topbar__label">Çıxış</span>
                <span className="admin-topbar__icon"><IoMdLogOut /></span>
              </button>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
