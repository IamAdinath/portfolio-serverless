import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faMedium } from '@fortawesome/free-brands-svg-icons';
import mediumArticlesData from '../../data/mediumArticles.json';
import './FeaturedMediumArticles.css';

interface FeaturedMediumArticlesProps {
  className?: string;
}

const FeaturedMediumArticles: React.FC<FeaturedMediumArticlesProps> = ({ className = '' }) => {
  const [currentBatch, setCurrentBatch] = useState(0);

  const batches = [];
  for (let i = 0; i < mediumArticlesData.length; i += 3) {
    batches.push(mediumArticlesData.slice(i, i + 3));
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
                  href={article.url}
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
