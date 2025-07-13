// src/components/sections/AboutMe.tsx - WITH TYPING ANIMATION
import React from 'react';
import { Heading } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faTwitter, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import { usePageTitle } from '../common/usePageTitle';
import Typewriter from 'typewriter-effect'; // ✅ Import the new library
import './AboutMe.css';

const socialLinks = [
  { href: "https://www.linkedin.com/in/primewhites/", icon: faLinkedin, label: "LinkedIn" },
  { href: "https://github.com/IamAdinath", icon: faGithub, label: "GitHub" },
  { href: "https://medium.com/@adinath.17", icon: faMedium, label: "Medium" },
  { href: "https:///twitter.com/prime_whites", icon: faTwitter, label: "Twitter/X" },
  { href: "https://stackoverflow.com/users/14975561/adinath-gore", icon: faStackOverflow, label: "StackOverflow" },
];

const AboutMe: React.FC = () => {
  usePageTitle('About Me | Adinath Gore');

  return (
    <div className="creative-about-page">
      {/* LEFT PANE: Unchanged */}
      <div className="left-pane">
        <div className="profile-image-container">
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mmyge4PjC3a10Dr9Ha7sEQ.jpeg"
            alt="Adinath - Software Engineer"
            className="profile-image"
          />
          <div className="image-overlay">
            <div className="social-links-overlay">
              {socialLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                  <FontAwesomeIcon icon={link.icon} className="social-icon-overlay" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: With the new typing animation */}
      <div className="right-pane">
        <div className="text-content-wrapper">
          
          {/* --- ✅ REPLACED HEADING WITH TYPEWRITER --- */}
          <Heading is="h1" className="main-heading">
            <Typewriter
              options={{
                strings: [
                  "Hi, I'm Adinath.",
                  "Software Engineer.",
                  "A Problem Solver.",
                ],
                autoStart: true,
                loop: true,
                delay: 30, // Speed of typing
                deleteSpeed: 55, // Speed of deleting
              }}
            />
          </Heading>

          <div className="bio-text">
            <p>
              I build elegant and efficient software solutions. With a keen eye for detail and a passion for clean code, I transform complex problems into intuitive user experiences.
            </p>
            <p>
              My journey is driven by curiosity and a commitment to continuous learning in the ever-evolving world of technology. Let's create something remarkable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;