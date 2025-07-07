import React from 'react';
import { Pane, Text, Heading } from 'evergreen-ui';
import './AboutMe.css'; // Import the specific CSS for AboutMe
import '../common/common.css'; // Correctly import the common CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faTwitter, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import { usePageTitle } from '../common/usePageTitle';

const AboutMe: React.FC = () => {
  return (
    usePageTitle('About Me'),
    <Pane className="about-container common-container"> {/* Apply the common container class */}
      <Heading size={600}>About Me</Heading>
      <div className="profile-container">
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mmyge4PjC3a10Dr9Ha7sEQ.jpeg"
          alt="Adinath - Software Engineer"
          className="profile-image"
        />
        <div className="social-links">
          <a href="https://www.linkedin.com/in/primewhites/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
          </a>
          <a href="https://github.com/IamAdinath" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="social-icon" />
          </a>
          <a href="https://twitter.com/prime_whites" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="social-icon" />
          </a>
          <a href="https://medium.com/@adinath.17" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faMedium} className="social-icon" />
          </a>
          <a href="https://stackoverflow.com/users/14975561/adinath-gore" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faStackOverflow} className="social-icon" />
          </a>
        </div>
      </div>

      <Text size={400} className="about-text">
        Hey there! I'm Adinath, a passionate software engineer with over 4 years of experience. My journey in the tech realm has been marked by a commitment to excellence and a keen eye for detail.
      </Text>

      {/* Additional about-text sections... */}
    </Pane>
  );
};

export default AboutMe;
