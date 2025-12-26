// src/pages/admin/QRAdmin.jsx
import React from 'react';
import QRCodeSection from '../../components/Common/QRCodeSection';

const QRAdmin = () => {
  return (
    <div className="qr-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">QR Kod</h1>
          <p className="admin-subtitle">Portfolio üçün QR kodunuzu idarə edin</p>
        </div>
      </div>
      <div className="qr-admin__grid">
        <QRCodeSection />
      </div>
    </div>
  );
};

export default QRAdmin;
