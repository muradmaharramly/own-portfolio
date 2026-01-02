import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/admin.scss';
import AdminLayout from '../components/Layout/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProfileAdmin from './admin/ProfileAdmin';
import EducationAdmin from './admin/EducationAdmin';
import ExperienceAdmin from './admin/ExperienceAdmin';
import ProjectsAdmin from './admin/ProjectsAdmin';
import LanguagesAdmin from './admin/LanguagesAdmin';
import MessagesAdmin from './admin/MessagesAdmin';
import ContactAdmin from './admin/ContactAdmin';
import SocialMediaAdmin from './admin/SocialMediaAdmin';
import DesignSettings from './admin/DesignSettings';
import QRAdmin from './admin/QRAdmin';

const AdminDashboard = () => {
  return (
    <AdminLayout>
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
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
