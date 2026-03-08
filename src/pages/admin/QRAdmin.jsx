import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiExternalLink, FiEyeOff, FiEye, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { supabase } from '../../services/supabaseClient';
import { TbLock, TbLockOpen } from 'react-icons/tb';

const QRAdmin = () => {
  const qrRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const portfolioUrl = window.location.origin;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsActive(data?.settings?.show_qr_code ?? true);
    } catch (error) {
      console.error('Error fetching QR settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQRStatus = async () => {
    const newStatus = !isActive;
    try {
      // First, get the single row ID and current settings
      const { data: settingsData, error: fetchError } = await supabase
        .from('site_settings')
        .select('id, settings')
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const updatedSettings = {
        ...(settingsData?.settings || {}),
        show_qr_code: newStatus
      };

      let result;
      if (settingsData?.id) {
        result = await supabase
          .from('site_settings')
          .update({
            settings: updatedSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', settingsData.id);
      } else {
        result = await supabase
          .from('site_settings')
          .insert({ settings: updatedSettings });
      }

      if (result.error) throw result.error;
      setIsActive(newStatus);
      toast.success(newStatus ? 'QR Kod aktiv edildi' : 'QR Kod deaktiv edildi');
    } catch (error) {
      toast.error('Xəta baş verdi: ' + error.message);
      console.error(error);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toast.info('Link kopyalandı');
  };

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'portfolio-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="qr-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">QR Kod</h1>
          <p className="admin-subtitle">Portfolio üçün QR kodunuzu idarə edin</p>
        </div>
        <div className="admin-header__actions">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <FiExternalLink />
            Sayta bax
          </a>
        </div>
      </div>

      <div className="qr-admin__content">
        <motion.div
          className={`qr-card ${!isActive ? 'qr-card--deactive' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="qr-card__left">
            <h3 className="qr-card__title">Ziyarət etmək üçün skan edin</h3>
            <p className="qr-card__description">
              Mobil cihazınızdan portfolioma daxil olmaq üçün bu QR kodu skan edin.
            </p>
            <div className="qr-card__meta">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="qr-card__url"
              >
                {portfolioUrl}
              </a>
              <button className="qr-card__copy-btn" onClick={copyUrl} title="Kopyala">
                <FiCopy />
              </button>
            </div>
            <div className='qr-actions'>
              <button
                onClick={downloadQR}
                className="btn-secondary qr-card__download"
                disabled={!isActive}
              >
                <FiDownload />
                QR Kodu yüklə
              </button>
              <button
                onClick={toggleQRStatus}
                className={`btn-${isActive ? 'ghost' : 'primary'} qr-card__toggle`}
              >
                {isActive ? <TbLock /> : <TbLockOpen />}
                {isActive ? 'Deaktiv et' : 'Aktiv et'}
              </button>
            </div>
          </div>

          <div className="qr-card__right">
            <div className="qr-card__wrapper">
              <div className="qr-card__code" ref={qrRef}>
                <QRCodeSVG
                  value={portfolioUrl}
                  size={260}
                  level="H"
                  includeMargin={true}
                  bgColor="var(--bg-primary)"
                  fgColor="var(--text-primary)"
                />
              </div>
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    className="qr-card__overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TbLock size={30} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRAdmin;
