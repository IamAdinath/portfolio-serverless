// Footer.tsx - Modern Portfolio Footer
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub, 
  faLinkedin, 
  faTwitter, 
  faMedium, 
  faStackOverflow 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faHeart, 
  faCode,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';
import { CONTACT, SOCIAL_LINKS } from '../../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: faLinkedin, url: SOCIAL_LINKS.LINKEDIN, label: 'LinkedIn' },
    { icon: faGithub, url: SOCIAL_LINKS.GITHUB, label: 'GitHub' },
    { icon: faTwitter, url: SOCIAL_LINKS.TWITTER, label: 'Twitter' },
    { icon: faMedium, url: SOCIAL_LINKS.MEDIUM, label: 'Medium' },
    { icon: faStackOverflow, url: SOCIAL_LINKS.STACKOVERFLOW, label: 'Stack Overflow' },
    { icon: faEnvelope, url: `mailto:${CONTACT.EMAIL}`, label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Resume', path: '/resume' },
    { label: 'Blogs', path: '/blogs' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-initials">AG</span>
              <span className="footer-logo-name">Adinath Gore</span>
            </div>
            <p className="footer-tagline">
              Full-Stack Developer & Cloud Architect passionate about creating 
              scalable web applications and innovative digital solutions.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  title={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <a href={`mailto:${CONTACT.EMAIL}`}>
                {CONTACT.EMAIL}
              </a>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faCode} />
              <span>Available for freelance projects</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} Adinath Gore. Made with{' '}
              <FontAwesomeIcon icon={faHeart} className="heart-icon" />{' '}
              using React & AWS
            </p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="scroll-to-top"
            title="Back to top"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
