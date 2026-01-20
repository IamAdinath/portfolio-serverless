import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faMedium } from '@fortawesome/free-brands-svg-icons';
import './FeaturedMediumArticles.css';

const mediumArticles = [
  {
    id: 1,
    title: 'Unlocking Backend Excellence: The Crucial Role of Unit Testing',
    publisher: 'Python in Plain English',
    link: 'https://medium.com/python-in-plain-english/unlocking-backend-excellence-the-crucial-role-of-unit-testing-d86f94206627',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Django REST Framework',
    publisher: 'Python in Plain English',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 3,
    title: 'AWS Lambda Best Practices for Production',
    publisher: 'AWS in Plain English',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 4,
    title: 'Microservices Architecture with Docker and Kubernetes',
    publisher: 'DevOps.dev',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 5,
    title: 'PostgreSQL Performance Optimization Techniques',
    publisher: 'Database Dive',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 6,
    title: 'Serverless Architecture: When and Why',
    publisher: 'Cloud Computing',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 7,
    title: 'React Hooks: A Complete Guide',
    publisher: 'JavaScript in Plain English',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 8,
    title: 'CI/CD Pipeline with GitHub Actions',
    publisher: 'DevOps.dev',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 9,
    title: 'Python Async/Await: Mastering Concurrency',
    publisher: 'Python in Plain English',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 10,
    title: 'GraphQL vs REST: Making the Right Choice',
    publisher: 'API Design',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 11,
    title: 'Monitoring and Logging in Production',
    publisher: 'DevOps.dev',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  },
  {
    id: 12,
    title: 'Security Best Practices for Web Applications',
    publisher: 'InfoSec Write-ups',
    link: 'https://medium.com/@adinathgore',
    image: 'https://via.placeholder.com/400x250/1a1a2e/00E5FF?text=Medium+Article'
  }
];

interface FeaturedMediumArticlesProps {
  className?: string;
}

const FeaturedMediumArticles: React.FC<FeaturedMediumArticlesProps> = ({ className = '' }) => {
  const [currentBatch, setCurrentBatch] = useState(0);

  const batches = [];
  for (let i = 0; i < mediumArticles.length; i += 3) {
    batches.push(mediumArticles.slice(i, i + 3));
  }

  const nextBatch = () => {
    setCurrentBatch((prev) => (prev + 1) % batches.length);
  };

  const prevBatch = () => {
    setCurrentBatch((prev) => (prev - 1 + batches.length) % batches.length);
  };

  return (
    <section className={`featured-medium-section ${className}`}>
      <div className="featured-medium-header">
        <h3>
          <FontAwesomeIcon icon={faMedium} className="featured-medium-icon" />
          Featured Articles on Medium
        </h3>
        <div className="featured-medium-controls">
          <button 
            onClick={prevBatch} 
            className="featured-medium-btn"
            disabled={batches.length <= 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="featured-medium-indicator">
            {currentBatch + 1} / {batches.length}
          </span>
          <button 
            onClick={nextBatch} 
            className="featured-medium-btn"
            disabled={batches.length <= 1}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      <div className="featured-medium-carousel">
        <div className="featured-medium-grid">
          {batches[currentBatch]?.map((article) => (
            <article key={article.id} className="featured-medium-card">
              <div className="featured-medium-image">
                <img 
                  src={article.image} 
                  alt={article.title}
                />
              </div>
              <div className="featured-medium-content">
                <h4 className="featured-medium-title">
                  {article.title}
                </h4>
                <p className="featured-medium-author">
                  Published in <strong>{article.publisher}</strong>
                </p>
                <a 
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-medium-link"
                >
                  Read on Medium <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMediumArticles;
