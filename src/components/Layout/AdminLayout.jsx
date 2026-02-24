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
import { FiMoon, FiSun, FiUser, FiDownload, FiMenu, FiX, FiBell } from 'react-icons/fi';
import { HiOutlineChartBar } from 'react-icons/hi';
import { PiGraduationCap } from 'react-icons/pi';
import { IoBriefcaseOutline, IoRocketOutline, IoShareSocialOutline } from 'react-icons/io5';
import { HiMiniLanguage } from 'react-icons/hi2';
import { CiMail } from 'react-icons/ci';
import { LuPhone, LuQrCode } from 'react-icons/lu';
import { fetchContactMessages, markAllMessagesAsRead } from '../../redux/slices/contactSlice';
import Logo from '../../assets/images/MM-Logo.png';
import { VscSymbolColor } from 'react-icons/vsc';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { messages = [] } = useSelector((state) => state.contact);
  const unreadCount = Array.isArray(messages) ? messages.filter(m => !m.is_read).length : 0;

  React.useEffect(() => {
    dispatch(fetchContactMessages());
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

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <h2 className="admin-sidebar__logo">Admin Panel</h2>
          <div
            className="admin-sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX/>
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
