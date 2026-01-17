import React, { useState, useEffect } from 'react';
import './AboutPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import { faHeart, faCode, faRocket, faLightbulb, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { usePageTitle } from '../common/usePageTitle';
import InitialsProfile from '../common/InitialsProfile';
import SEOHead from '../common/SEOHead';
import { SOCIAL_LINKS } from '../../constants';
import { getProfileImage } from '../common/apiService';

const AboutPage: React.FC = () => {
  usePageTitle('About Me');
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const { imageUrl } = await getProfileImage();
        setProfileImageUrl(imageUrl);
        
        // Update CSS variable for the background image
        const container = document.querySelector('.profile-image-container') as HTMLElement;
        if (container && imageUrl) {
          container.style.setProperty('--profile-image-url', `url(${imageUrl})`);
        }
      } catch (error) {
        console.error('Failed to load profile image:', error);
      }
    };
    fetchProfileImage();
  }, []);
  
  return (
    <>
      <SEOHead
        title="About Me - Adinath Gore | Full Stack Developer"
        description="Learn about Adinath Gore, a passionate Full Stack Developer with 5+ years of experience in React, Node.js, AWS, and modern web technologies. Discover my journey, skills, and passion for creating innovative solutions."
        keywords={[
          'About Adinath Gore',
          'Full Stack Developer Story',
          'Software Engineer Background',
          'React Developer Experience',
          'Node.js Expert',
          'AWS Professional',
          'Web Development Journey',
          'Programming Passion'
        ]}
        url="/about"
        type="profile"
      />
      <div className="about-container">
      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-content">
          <div className="profile-section">
            <div className="profile-image-container">
              {/* 
                To use your LinkedIn profile picture:
                1. Go to your LinkedIn profile
                2. Right-click on your profile picture
                3. Select "Copy image address" or "Copy image URL"
                4. Replace the src URL below with your LinkedIn image URL
                
                Note: LinkedIn images may have authentication requirements.
                For production, consider uploading your professional photo to your own server/CDN.
              */}
              <InitialsProfile 
                className="profile-image"
                size="medium"
                initials="AG"
              />
            </div>
            <div className="profile-info">
              <h1>Hey there! I'm Adinath</h1>
              <h2>Passionate Software Engineer</h2>
              <p className="profile-tagline">
                Crafting digital experiences with <FontAwesomeIcon icon={faHeart} className="heart-icon" /> and precision
              </p>
            </div>
          </div>
          
          <div className="social-links">
            <a href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
              <FontAwesomeIcon icon={faLinkedin} />
              <span>LinkedIn</span>
            </a>
            <a href={SOCIAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" className="social-link github">
              <FontAwesomeIcon icon={faGithub} />
              <span>GitHub</span>
            </a>
            {/* <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" className="social-link twitter">
              <FontAwesomeIcon icon={faTwitter} />
              <span>Twitter</span>
            </a> */}
            <a href={SOCIAL_LINKS.MEDIUM} target="_blank" rel="noopener noreferrer" className="social-link medium">
              <FontAwesomeIcon icon={faMedium} />
              <span>Medium</span>
            </a>
            <a href={SOCIAL_LINKS.STACKOVERFLOW} target="_blank" rel="noopener noreferrer" className="social-link stackoverflow">
              <FontAwesomeIcon icon={faStackOverflow} />
              <span>Stack Overflow</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Content */}
      <div className="about-content">
        {/* Journey Card */}
        <section className="about-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faRocket} className="section-icon" />
            <h3>My Journey</h3>
          </div>
          <div className="card-content">
            <p>
              With over <strong>5 years of experience</strong> in the tech realm, my journey has been marked by a commitment to excellence and a keen eye for detail. I've evolved from a curious beginner to a seasoned professional who thrives on solving complex problems and building scalable solutions.
            </p>
            <p>
              My passion lies in creating digital experiences that not only meet technical requirements but also delight users. Every line of code I write is driven by the desire to make technology more accessible and impactful.
            </p>
          </div>
        </section>

        {/* What I Do Card */}
        <section className="about-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faCode} className="section-icon" />
            <h3>What I Do</h3>
          </div>
          <div className="card-content">
            <div className="skills-grid">
              <div className="skill-item">
                <h4>Full-Stack Development</h4>
                <p>Building end-to-end applications with modern technologies like Python, Django, React, and AWS.</p>
              </div>
              <div className="skill-item">
                <h4>Cloud Architecture</h4>
                <p>Designing scalable, serverless solutions using AWS services like Lambda, API Gateway, and DynamoDB.</p>
              </div>
              <div className="skill-item">
                <h4>API Development</h4>
                <p>Creating robust REST APIs and GraphQL endpoints with proper authentication and optimization.</p>
              </div>
              <div className="skill-item">
                <h4>Team Leadership</h4>
                <p>Leading development teams, conducting code reviews, and mentoring junior developers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Card */}
        <section className="about-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faLightbulb} className="section-icon" />
            <h3>My Philosophy</h3>
          </div>
          <div className="card-content">
            <div className="philosophy-items">
              <div className="philosophy-item">
                <FontAwesomeIcon icon={faCode} className="philosophy-icon" />
                <div>
                  <h4>Clean Code</h4>
                  <p>Writing maintainable, readable code that stands the test of time.</p>
                </div>
              </div>
              <div className="philosophy-item">
                <FontAwesomeIcon icon={faRocket} className="philosophy-icon" />
                <div>
                  <h4>Continuous Learning</h4>
                  <p>Staying updated with the latest technologies and best practices.</p>
                </div>
              </div>
              <div className="philosophy-item">
                <FontAwesomeIcon icon={faHeart} className="philosophy-icon" />
                <div>
                  <h4>User-Centric Design</h4>
                  <p>Building solutions that prioritize user experience and accessibility.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fun Facts Card */}
        <section className="about-card fun-facts">
          <div className="card-header">
            <FontAwesomeIcon icon={faCoffee} className="section-icon" />
            <h3>Fun Facts</h3>
          </div>
          <div className="card-content">
            <div className="fun-facts-grid">
              <div className="fun-fact">
                <span className="fact-number">500+</span>
                <span className="fact-label">Cups of Coffee</span>
              </div>
              <div className="fun-fact">
                <span className="fact-number">50+</span>
                <span className="fact-label">Projects Completed</span>
              </div>
              <div className="fun-fact">
                <span className="fact-number">7</span>
                <span className="fact-label">Team Members Led</span>
              </div>
              <div className="fun-fact">
                <span className="fact-number">∞</span>
                <span className="fact-label">Lines of Code</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default AboutPage;
