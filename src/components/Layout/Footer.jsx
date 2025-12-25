// ============================================
// components/Layout/Footer.jsx
// ============================================

import { useSelector } from 'react-redux';
import { FiHeart, FiLink } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

const Footer = () => {
  const { items: socialMedia } = useSelector((state) => state.socialMedia);
  const year = new Date().getFullYear();
  
  const resolveIcon = (name) => {
    if (!name || typeof name !== 'string') return FiLink;
    const prefix = name.slice(0, 2);
    if (prefix === 'Fi' && FiIcons[name]) return FiIcons[name];
    if (prefix === 'Fa' && FaIcons[name]) return FaIcons[name];
    if (prefix === 'Si' && SiIcons[name]) return SiIcons[name];
    return FiLink;
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__social">
            {socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.platform_url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={social.platform_name}
              >
                {(() => {
                  const Icon = resolveIcon(social.icon_name);
                  return <Icon />;
                })()}
              </a>
            ))}
          </div>

          <p className="footer__text">
            Made with <FiHeart className="footer__heart" /> by Me
          </p>

          <p className="footer__copyright">
            © {year} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
