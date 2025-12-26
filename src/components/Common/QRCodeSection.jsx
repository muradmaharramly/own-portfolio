// ============================================
// components/Home/QRCode.jsx
// ============================================

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const QRCodeSection = () => {
  const qrRef = useRef(null);
  const portfolioUrl = window.location.origin;

  const downloadQR = () => {
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
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <section className="qr-section section">
      <div className="container">
        <motion.div
          className="qr-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="qr-card__left">
            <h3 className="qr-card__title">Scan to Visit</h3>
            <p className="qr-card__description">
              Scan this QR code to visit my portfolio on your mobile device
            </p>
            <button onClick={downloadQR} className="qr-card__download btn-primary">
              <FiDownload />
              Download QR Code
            </button>
          </div>
          <div className="qr-card__right">
            <div className="qr-card__code" ref={qrRef}>
              <QRCodeSVG
                value={portfolioUrl}
                size={220}
                level="H"
                includeMargin={true}
                bgColor="var(--bg-primary)"
                fgColor="var(--text-primary)"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QRCodeSection;
