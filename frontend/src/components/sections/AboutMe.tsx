// AboutMe.tsx
import React from 'react';
import { Pane, Text, Heading } from 'evergreen-ui';
import './AboutMe.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faTwitter, faStackOverflow } from '@fortawesome/free-brands-svg-icons';

const AboutMe: React.FC = () => {
  return (
    <Pane className="about-container">
      <Heading size={600}> About Me </Heading>
      <div className="profile-container">
        {/* Professional Photo */}
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mmyge4PjC3a10Dr9Ha7sEQ.jpeg"
          alt="Adinath - Software Engineer"
          className="profile-image"
        />
        
        {/* Social Media Links */}
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
          <a href="https://github.com/IamAdinath" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="social-icon" />
          </a>
          <a href="https://stackoverflow.com/users/14975561/adinath-gore" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faStackOverflow} className="social-icon" />
          </a>
        </div>
      </div>

      <Text size={400} className="about-text">
        Hey there! I'm Adinath, a passionate software engineer with over 4 years of experience. My journey in the tech realm has been marked by a commitment to excellence and a keen eye for detail.
      </Text>

      <Text size={400} className="about-text">
        Specializing in Python, I've successfully navigated diverse projects, each presenting unique challenges. One notable project includes [mention a specific project or two here], showcasing my ability to create innovative solutions.
      </Text>

      <Text size={400} className="about-text">
        While I don't hold a traditional degree, I've earned certifications validating my expertise. My journey underscores the value of continuous learning and adaptability in the ever-evolving tech landscape.
      </Text>

      <Text size={400} className="about-text">
        What fuels my passion for being a software engineer is the thrill of problem-solving. I revel in dissecting complex challenges, devising innovative solutions, and witnessing the transformative impact of technology on real-world issues.
      </Text>

      <Text size={400} className="about-text">
        Beyond the code, you might find me [mention any hobbies or interests you'd like to share, or let me know if you'd like me to come up with something].
      </Text>
    </Pane>
  );
};

export default AboutMe;
