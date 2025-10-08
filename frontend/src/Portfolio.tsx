// Portfolio.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faCode, faUser, faBlog, faQuoteLeft, faArrowRight, faDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { usePageTitle } from './components/common/usePageTitle';
import ProfileImage from './components/common/ProfileImage';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  usePageTitle('Portfolio');
  
  const latestBlogs = [
    { 
      id: 1, 
      title: 'Building Scalable Web Applications', 
      snippet: 'Exploring modern architecture patterns and best practices for creating maintainable, scalable web applications.',
      readTime: '5 min read',
      date: 'Dec 2024'
    },
    { 
      id: 2, 
      title: 'Serverless Architecture with AWS', 
      snippet: 'Deep dive into serverless computing, Lambda functions, and building cost-effective cloud solutions.',
      readTime: '8 min read',
      date: 'Nov 2024'
    },
    { 
      id: 3, 
      title: 'React Performance Optimization', 
      snippet: 'Tips and techniques for optimizing React applications for better user experience and performance.',
      readTime: '6 min read',
      date: 'Oct 2024'
    },
  ];

  const testimonials = [
    { 
      id: 1, 
      quote: 'Adinath delivered exceptional results on our project. His technical expertise and attention to detail were outstanding.', 
      author: 'Sarah Johnson',
      position: 'Project Manager @ TechCorp',
      rating: 5
    },
    { 
      id: 2, 
      quote: 'Working with Adinath was a pleasure. He brought innovative solutions and maintained excellent communication throughout.', 
      author: 'Michael Chen',
      position: 'CTO @ StartupX',
      rating: 5
    },
  ];

  const skills = [
    { name: 'Full-Stack Development', level: 95 },
    { name: 'Cloud Architecture', level: 90 },
    { name: 'API Development', level: 92 },
    { name: 'Team Leadership', level: 88 },
  ];

  return (
    <div className="portfolio-main-container">
      {/* Hero Section */}
      <section className="portfolio-hero-section">
        <div className="portfolio-hero-content">
          <div className="portfolio-hero-text">
            <h1>Hi, I'm Adinath Gore</h1>
            <h2>Full-Stack Developer & Cloud Architect</h2>
            <p className="portfolio-hero-description">
              Passionate about creating scalable web applications and cloud solutions. 
              With 5+ years of experience, I help businesses build robust digital experiences 
              that drive growth and innovation.
            </p>
            <div className="portfolio-hero-stats">
              <div className="portfolio-stat">
                <span className="portfolio-stat-number">50+</span>
                <span className="portfolio-stat-label">Projects</span>
              </div>
              <div className="portfolio-stat">
                <span className="portfolio-stat-number">5+</span>
                <span className="portfolio-stat-label">Years</span>
              </div>
              <div className="portfolio-stat">
                <span className="portfolio-stat-number">7</span>
                <span className="portfolio-stat-label">Team Size</span>
              </div>
            </div>
            <div className="portfolio-hero-actions">
              <Link to="/about" className="portfolio-btn portfolio-btn-primary">
                <FontAwesomeIcon icon={faUser} />
                About Me
              </Link>
              <Link to="/resume" className="portfolio-btn portfolio-btn-secondary">
                <FontAwesomeIcon icon={faDownload} />
                View Resume
              </Link>
            </div>
          </div>
          <div className="portfolio-hero-image">
            <div className="portfolio-profile-card">
              <ProfileImage 
                className="portfolio-profile-image"
                size="large"
              />
              <div className="portfolio-profile-badge">
                <FontAwesomeIcon icon={faRocket} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="portfolio-skills-overview">
        <div className="portfolio-section-header">
          <h3>
            <FontAwesomeIcon icon={faCode} className="portfolio-section-icon" />
            Core Expertise
          </h3>
        </div>
        <div className="portfolio-skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="portfolio-skill-card">
              <div className="portfolio-skill-info">
                <span className="portfolio-skill-name">{skill.name}</span>
                <span className="portfolio-skill-percentage">{skill.level}%</span>
              </div>
              <div className="portfolio-skill-bar">
                <div 
                  className="portfolio-skill-progress" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="portfolio-blog-section">
        <div className="portfolio-section-header">
          <h3>
            <FontAwesomeIcon icon={faBlog} className="portfolio-section-icon" />
            Latest Blog Posts
          </h3>
          <Link to="/blogs" className="portfolio-section-link">
            View All <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
        <div className="portfolio-blog-grid">
          {latestBlogs.map((blog) => (
            <article key={blog.id} className="portfolio-blog-card">
              <div className="portfolio-blog-meta">
                <span className="portfolio-blog-date">{blog.date}</span>
                <span className="portfolio-blog-read-time">{blog.readTime}</span>
              </div>
              <h4 className="portfolio-blog-title">{blog.title}</h4>
              <p className="portfolio-blog-snippet">{blog.snippet}</p>
              <Link to={`/blog/${blog.id}`} className="portfolio-blog-link">
                Read More <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="portfolio-testimonials-section">
        <div className="portfolio-section-header">
          <h3>
            <FontAwesomeIcon icon={faQuoteLeft} className="portfolio-section-icon" />
            What Clients Say
          </h3>
        </div>
        <div className="portfolio-testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="portfolio-testimonial-card">
              <div className="portfolio-testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="portfolio-star" />
                ))}
              </div>
              <blockquote className="portfolio-testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
              <div className="portfolio-testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.position}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect Section */}
      <section className="portfolio-connect-section">
        <div className="portfolio-connect-content">
          <h3>Let's Connect</h3>
          <p>Ready to discuss your next project or just want to say hello?</p>
          <div className="portfolio-social-links">
            <a href="https://www.linkedin.com/in/primewhites/" target="_blank" rel="noopener noreferrer" className="portfolio-social-link linkedin">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/IamAdinath" target="_blank" rel="noopener noreferrer" className="portfolio-social-link github">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://medium.com/@adinath.17" target="_blank" rel="noopener noreferrer" className="portfolio-social-link medium">
              <FontAwesomeIcon icon={faMedium} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;