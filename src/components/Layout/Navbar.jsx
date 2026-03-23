import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import Logo from '../../assets/images/MM-Logo.webp';
import { FiHeart, FiLink } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const { items: socialMedia } = useSelector((state) => state.socialMedia);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Languages', href: '#languages' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };



  const resolveIcon = (name) => {
    if (!name || typeof name !== 'string') return FiLink;
    const prefix = name.slice(0, 2);
    if (prefix === 'Fi' && FiIcons[name]) return FiIcons[name];
    if (prefix === 'Fa' && FaIcons[name]) return FaIcons[name];
    if (prefix === 'Si' && SiIcons[name]) return SiIcons[name];
    return FiLink;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-wrapper">
            <img src={Logo} alt="Logo" className="navbar__logo-img" />
          </div>
          <span className="gradient-text">Portfolio</span>
        </Link>

        <div className={`navbar__menu ${isMobileMenuOpen ? 'active' : ''}`} ref={menuRef}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="navbar__link"
            >
              {link.name}
            </a>
          ))}
          <div className="footer__social">
            {socialMedia
              .filter((social) =>
                ["whatsapp", "instagram", "linkedin"].includes(
                  social.platform_name.toLowerCase()
                )
              )
              .map((social) => (
                <a
                  key={social.id}
                  href={social.platform_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link nav"
                  aria-label={social.platform_name}
                >
                  {(() => {
                    const Icon = resolveIcon(social.icon_name);
                    return <Icon />;
                  })()}
                </a>
              ))}
          </div>
        </div>

        <div className="navbar__actions">
          <div
            onClick={() => dispatch(toggleTheme())}
            className="navbar__theme-toggle"
            aria-label="Toggle theme"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch(toggleTheme())}
          >
            {mode === 'light' ? <FiMoon /> : <FiSun />}
          </div>

          <div
            ref={toggleRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar__mobile-toggle"
            aria-label="Toggle menu"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;