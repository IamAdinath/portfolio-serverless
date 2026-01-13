import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FontAwesomeIcon,
  faRocket, 
  faCode, 
  faUser, 
  faBlog, 
  faQuoteLeft, 
  faArrowRight, 
  faDownload, 
  faStar,
  faLinkedin, 
  faGithub, 
  faMedium 
} from '../utils/iconLibrary';
import { usePageTitle } from './components/common/usePageTitle';
import ProfileImage from './components/common/ProfileImage';
import SEOHead from './components/common/SEOHead';
import { SOCIAL_LINKS } from './constants';
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
    { name: 'Python Development', level: 95 },
    { name: 'Cloud Engineering', level: 92 },
    { name: 'AWS Services', level: 90 },
    { name: 'DevOps & CI/CD', level: 88 },
  ];

  return (
    <>
      <SEOHead
        title="Adinath Gore - Python Developer & Cloud Engineer"
        description="Experienced Python Developer and Cloud Engineer specializing in AWS, Django, Flask, serverless architecture, and cloud solutions. View my portfolio, projects, and professional experience."
        keywords={[
          'Adinath Gore',
          'Python Developer',
          'Cloud Engineer',
          'AWS Developer',
          'Django Developer',
          'Flask Developer',
          'Serverless Architecture',
          'Cloud Solutions',
          'Portfolio'
        ]}
        url="/"
        type="profile"
      />
      <div className="portfolio-main-container">
        {/* Hero Section */}
        <section className="portfolio-hero-section">
          <div className="portfolio-hero-content">
            <div className="portfolio-hero-text">
              <h1>Hi, I'm Adinath Gore</h1>
              <h2>Python Developer & Cloud Engineer</h2>
              <p className="portfolio-hero-description">
                Passionate about building scalable cloud solutions and Python applications.
                With 5+ years of experience, I help businesses leverage cloud technologies
                and develop robust backend systems that drive growth and innovation.
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
                  priority={true}
                  loading="eager"
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
        {/* Site Navigation */}
        <section className="portfolio-navigation-section">
          <div className="portfolio-navigation-content">
            <h3>Explore My Work</h3>
            <p>Discover more about my experience, projects, and insights</p>
            <div className="portfolio-nav-grid">
              <div className="portfolio-nav-card">
                <h4>
                  <FontAwesomeIcon icon={faUser} />
                  About Me
                </h4>
                <p>Learn about my journey, skills, and passion for development</p>
                <Link to="/about" className="portfolio-nav-link">
                  Read My Story <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
              <div className="portfolio-nav-card">
                <h4>
                  <FontAwesomeIcon icon={faDownload} />
                  Resume
                </h4>
                <p>View my professional experience, skills, and achievements</p>
                <Link to="/resume" className="portfolio-nav-link">
                  View Resume <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
              <div className="portfolio-nav-card">
                <h4>
                  <FontAwesomeIcon icon={faBlog} />
                  Blog Posts
                </h4>
                <p>Read my thoughts on technology, development, and industry trends</p>
                <Link to="/blogs" className="portfolio-nav-link">
                  Read Articles <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
              <div className="portfolio-nav-card">
                <h4>
                  <FontAwesomeIcon icon={faCode} />
                  Projects
                </h4>
                <p>Explore my portfolio of web applications and software solutions</p>
                <Link to="/about#projects" className="portfolio-nav-link">
                  View Projects <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="portfolio-connect-section">
          <div className="portfolio-connect-content">
            <h3>Let's Connect</h3>
            <p>Ready to discuss your next project or just want to say hello?</p>
            <div className="portfolio-social-links">
              <a 
                href={SOCIAL_LINKS.LINKEDIN} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="portfolio-social-link linkedin"
                aria-label="Visit Adinath Gore's LinkedIn profile"
                title="LinkedIn Profile"
              >
                <FontAwesomeIcon icon={faLinkedin} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href={SOCIAL_LINKS.GITHUB} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="portfolio-social-link github"
                aria-label="Visit Adinath Gore's GitHub profile"
                title="GitHub Profile"
              >
                <FontAwesomeIcon icon={faGithub} />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href={SOCIAL_LINKS.MEDIUM} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="portfolio-social-link medium"
                aria-label="Visit Adinath Gore's Medium blog"
                title="Medium Blog"
              >
                <FontAwesomeIcon icon={faMedium} />
                <span className="sr-only">Medium</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Portfolio;