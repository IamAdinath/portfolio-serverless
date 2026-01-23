import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FontAwesomeIcon,
  faCode, 
  faUser, 
  faBlog, 
  // faQuoteLeft, // Temporarily hidden - testimonials
  faArrowRight, 
  faDownload, 
  faEye,
  // faStar, // Temporarily hidden - testimonials
  faLinkedin, 
  faGithub, 
  faMedium,
  faGraduationCap,
  faChevronLeft,
  faChevronRight,
  faExternalLinkAlt
} from './utils/iconLibrary';
import { usePageTitle } from './components/common/usePageTitle';
import ProfileImageCard from './components/common/ProfileImageCard';
import SEOHead from './components/common/SEOHead';
import { SOCIAL_LINKS } from './constants';
import { GetAllPublishedBlogs } from './components/common/apiService';
import { Blog } from './types';
import FeaturedMediumArticles from './components/sections/FeaturedMediumArticles';
import './HomePage.css';

const HomePage: React.FC = () => {
  usePageTitle('Portfolio');
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [currentCertBatch, setCurrentCertBatch] = useState(0);
  const [currentSkillBatch, setCurrentSkillBatch] = useState(0);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const blogs = await GetAllPublishedBlogs();
        setLatestBlogs(blogs.slice(0, 3)); // Get only the latest 3 blogs
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        // Keep empty array on error
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);



  const certificates = [
    {
      id: 1,
      name: 'Artificial Intelligence and Business Strategy',
      issuer: 'LinkedIn Learning',
      date: '2023',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
      link: 'https://www.linkedin.com/learning/certificates/e8c4b5ded0908d47fb2d6458a1ed6c219de127e34f6beb3842305de91b92b909?u=1810',
      level: 'Professional'
    },
    {
      id: 2,
      name: 'Python for Data Science and Machine Learning Bootcamp',
      issuer: 'Udemy',
      date: '2023',
      logo: 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg',
      link: 'https://www.udemy.com/certificate/UC-bc48da75-4011-42bc-9d09-f7fc1151e022/?utm_source=sendgrid.com&utm_medium=email&utm_campaign=email',
      level: 'Certificate'
    },
    {
      id: 3,
      name: 'Python, JS, & React | Build a Blockchain & Cryptocurrency',
      issuer: 'Udemy',
      date: '2022',
      logo: 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg',
      link: 'https://www.udemy.com/certificate/UC-b4e524ff-92af-45f5-82c6-01163bea9f2a/',
      level: 'Certificate'
    },
    {
      id: 4,
      name: 'Python Certification',
      issuer: 'HackerRank',
      date: '2022',
      logo: 'https://hrcdn.net/fcore/assets/brand/logo-new-white-green-a5cb16e0ae.svg',
      link: 'https://www.hackerrank.com/certificates/36ca56e7716a',
      level: 'Certified'
    },
    {
      id: 5,
      name: 'SQL Certification',
      issuer: 'HackerRank',
      date: '2022',
      logo: 'https://hrcdn.net/fcore/assets/brand/logo-new-white-green-a5cb16e0ae.svg',
      link: 'https://www.hackerrank.com/certificates/aadd3de22555',
      level: 'Certified'
    }
  ];

  const certBatches = [];
  for (let i = 0; i < certificates.length; i += 4) {
    certBatches.push(certificates.slice(i, i + 4));
  }

  const nextCertBatch = () => {
    setCurrentCertBatch((prev) => (prev + 1) % certBatches.length);
  };

  const prevCertBatch = () => {
    setCurrentCertBatch((prev) => (prev - 1 + certBatches.length) % certBatches.length);
  };

  // Testimonials data - temporarily hidden
  // const testimonials = [
  //   {
  //     id: 1,
  //     quote: 'Adinath delivered exceptional results on our project. His technical expertise and attention to detail were outstanding.',
  //     author: 'Sarah Johnson',
  //     position: 'Project Manager @ TechCorp',
  //     rating: 5
  //   },
  //   {
  //     id: 2,
  //     quote: 'Working with Adinath was a pleasure. He brought innovative solutions and maintained excellent communication throughout.',
  //     author: 'Michael Chen',
  //     position: 'CTO @ StartupX',
  //     rating: 5
  //   },
  // ];

  const skillBatches = React.useMemo(() => {
    const skills = [
      { 
        name: 'Python', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        level: 95 
      },
      { 
        name: 'AWS', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
        level: 92 
      },
      { 
        name: 'Django', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
        level: 90 
      },
      { 
        name: 'Docker', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        level: 88 
      },
      { 
        name: 'PostgreSQL', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        level: 85 
      },
      { 
        name: 'React', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        level: 82 
      },
      { 
        name: 'MongoDB', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        level: 80 
      },
      { 
        name: 'Git', 
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        level: 90 
      }
    ];
    
    const batches = [];
    for (let i = 0; i < skills.length; i += 4) {
      batches.push(skills.slice(i, i + 4));
    }
    return batches;
  }, []);

  // Auto-rotate skills carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillBatch((prev) => (prev + 1) % skillBatches.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [skillBatches.length]);

  return (
    <>
      <SEOHead
        title="Adinath Gore - Full Stack Imagineer"
        description="Experienced Full Stack Imagineer specializing in AWS, Django, Flask, React, serverless architecture, and cloud solutions. View my portfolio, projects, and professional experience."
        keywords={[
          'Adinath Gore',
          'Full Stack Imagineer',
          'Full Stack Developer',
          'AWS Developer',
          'Django Developer',
          'React Developer',
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
              <h2>Full Stack Imagineer</h2>
              <p className="portfolio-hero-description">
                I imagine it first, then I build it.
                I create modern digital experiences that feel effortless.
                Fast, reliable, and designed with care.
                Made for today, ready for tomorrow.
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
                  <FontAwesomeIcon icon={faEye} />
                  View Resume
                </Link>
              </div>
            </div>
            <div className="portfolio-hero-image">
              <ProfileImageCard size="large" />
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
          <div className="portfolio-skills-carousel">
            <div className="portfolio-skills-grid">
              {skillBatches[currentSkillBatch]?.map((skill, index) => (
                <div key={index} className="portfolio-skill-card">
                  <div className="portfolio-skill-logo">
                    <img src={skill.logo} alt={`${skill.name} logo`} />
                  </div>
                  <div className="portfolio-skill-info">
                    <span className="portfolio-skill-name">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section className="portfolio-certificates-section">
          <div className="portfolio-section-header">
            <h3>
              <FontAwesomeIcon icon={faGraduationCap} className="portfolio-section-icon" />
              Certifications
            </h3>
            <div className="portfolio-carousel-controls">
              <button 
                onClick={prevCertBatch} 
                className="portfolio-carousel-btn"
                disabled={certBatches.length <= 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="portfolio-carousel-indicator">
                {currentCertBatch + 1} / {certBatches.length}
              </span>
              <button 
                onClick={nextCertBatch} 
                className="portfolio-carousel-btn"
                disabled={certBatches.length <= 1}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          <div className="portfolio-certificates-carousel">
            <div className="portfolio-certificates-grid">
              {certBatches[currentCertBatch]?.map((cert) => (
                <div key={cert.id} className="portfolio-certificate-card">
                  <div className="portfolio-cert-logo">
                    <img src={cert.logo} alt={`${cert.name} logo`} />
                  </div>
                  <div className="portfolio-cert-info">
                    <h4 className="portfolio-cert-name">{cert.name}</h4>
                    <p className="portfolio-cert-issuer">{cert.issuer}</p>
                    <div className="portfolio-cert-meta">
                      <span className="portfolio-cert-level">{cert.level}</span>
                      <span className="portfolio-cert-date">{cert.date}</span>
                    </div>
                    <a 
                      href={cert.link} 
                      className="portfolio-cert-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
            {blogsLoading ? (
              <div className="portfolio-blog-loading">
                Loading latest posts...
              </div>
            ) : latestBlogs.length > 0 ? (
              latestBlogs.map((blog) => {
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString);
                  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                };
                
                const calculateReadTime = (content: string) => {
                  const text = content.replace(/<[^>]+>/g, '');
                  const wordCount = text.trim().split(/\s+/).length;
                  const readTime = Math.ceil(wordCount / 225);
                  return `${readTime} min read`;
                };
                
                const createSnippet = (content: string) => {
                  const text = content.replace(/<[^>]+>/g, '');
                  return text.length > 150 ? text.substring(0, 150) + '...' : text;
                };
                
                return (
                  <article key={blog.id} className="portfolio-blog-card">
                    <div className="portfolio-blog-meta">
                      <span className="portfolio-blog-date">
                        {blog.published_at ? formatDate(blog.published_at) : 'Recent'}
                      </span>
                      <span className="portfolio-blog-read-time">
                        {calculateReadTime(blog.content)}
                      </span>
                    </div>
                    <h4 className="portfolio-blog-title">{blog.title}</h4>
                    <p className="portfolio-blog-snippet">{createSnippet(blog.content)}</p>
                    <Link to={`/blog/${blog.id}`} className="portfolio-blog-link">
                      Read More <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </article>
                );
              })
            ) : (
              <div className="portfolio-blog-empty">
                <p>No blog posts available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Medium Articles */}
        <section className="portfolio-featured-section">
          <FeaturedMediumArticles />
        </section>

        {/* Testimonials - Temporarily Hidden */}
        {/* <section className="portfolio-testimonials-section">
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
        </section> */}

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

export default HomePage;