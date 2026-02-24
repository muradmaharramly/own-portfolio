import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/admin.scss';
import AdminLayout from '../components/Layout/AdminLayout';

const Dashboard = lazy(() => import('./admin/Dashboard'));
const ProfileAdmin = lazy(() => import('./admin/ProfileAdmin'));
const EducationAdmin = lazy(() => import('./admin/EducationAdmin'));
const ExperienceAdmin = lazy(() => import('./admin/ExperienceAdmin'));
const ProjectsAdmin = lazy(() => import('./admin/ProjectsAdmin'));
const LanguagesAdmin = lazy(() => import('./admin/LanguagesAdmin'));
const MessagesAdmin = lazy(() => import('./admin/MessagesAdmin'));
const ContactAdmin = lazy(() => import('./admin/ContactAdmin'));
const SocialMediaAdmin = lazy(() => import('./admin/SocialMediaAdmin'));
const DesignSettings = lazy(() => import('./admin/DesignSettings'));
const QRAdmin = lazy(() => import('./admin/QRAdmin'));
const SiteAnalyticsAdmin = lazy(() => import('./admin/SiteAnalyticsAdmin'));

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="admin-loading">Loading...</div>}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="languages" element={<LanguagesAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="social-media" element={<SocialMediaAdmin />} />
          <Route path="qr" element={<QRAdmin />} />
          <Route path="design" element={<DesignSettings />} />
          <Route path="analytics" element={<SiteAnalyticsAdmin />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminDashboard;
