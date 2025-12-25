// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  FaSignOutAlt
} from 'react-icons/fa';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { signOut } from '../../redux/slices/authSlice';
import { IoMdLogOut } from 'react-icons/io';
import { FiMoon, FiSun } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: <FaChartBar />, label: 'Dashboard', end: true },
    { path: '/admin/profile', icon: <FaUser />, label: 'Profil' },
    { path: '/admin/education', icon: <FaGraduationCap />, label: 'Təhsil' },
    { path: '/admin/experience', icon: <FaBriefcase />, label: 'Təcrübə' },
    { path: '/admin/projects', icon: <FaRocket />, label: 'Proyektlər' },
    { path: '/admin/languages', icon: <FaGlobe />, label: 'Dillər' },
    { path: '/admin/social-media', icon: <FaShareAlt />, label: 'Sosial Media' },
    { path: '/admin/contact', icon: <FaEnvelope />, label: 'Əlaqə' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <h2 className="admin-sidebar__logo">Admin Panel</h2>
          <button 
            className="admin-sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
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
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button 
            className="admin-sidebar__link admin-sidebar__link--danger"
            onClick={handleLogout}
          >
            <span className="admin-sidebar__icon"><IoMdLogOut /></span>
            <span className="admin-sidebar__label">Çıxış</span>
          </button>
        </div>
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
          <button 
            className="admin-topbar__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          <div className="admin-topbar__actions">
            <div 
              className="admin-topbar__theme"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <FiSun /> : <FiMoon />}
            </div>

            <div className="admin-topbar__user">
              <span className="admin-topbar__user-name">{user?.email}</span>
              <div className="admin-topbar__user-avatar">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
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