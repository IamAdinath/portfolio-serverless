import React from 'react';
import './SuggestedBlogs.css';
import { SuggestedBlogsProps } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faUser, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const SuggestedBlogs: React.FC<SuggestedBlogsProps> = ({ suggestions }) => {
  return (
    <div className="suggested-blogs-main-container">
      <div className="suggested-blogs-section">
        <div className="suggested-blogs-header">
          <h3>
            <FontAwesomeIcon icon={faLightbulb} />
            Suggested Blogs
          </h3>
          <p>Discover more interesting content you might enjoy</p>
        </div>
        
        {suggestions && suggestions.length > 0 ? (
          <div className="suggested-blogs-container">
            {suggestions.map((suggestion) => (
              <Link 
                key={suggestion.id} 
                to={`/blog/${suggestion.id}`}
                className="suggested-blogs-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {suggestion.thumbnail && (
                  <img 
                    src={suggestion.thumbnail} 
                    alt={suggestion.title} 
                    className="suggested-blogs-thumbnail" 
                  />
                )}
                <h4 className="suggested-blogs-title">{suggestion.title}</h4>
                <p className="suggested-blogs-author">
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '6px' }} />
                  by {suggestion.author}
                </p>
                <div className="suggested-blogs-meta">
                  <div className="suggested-blogs-meta-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span>5 min read</span>
                  </div>
                  <div className="suggested-blogs-meta-item">
                    <FontAwesomeIcon icon={faBookOpen} />
                    <span>Article</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="suggested-blogs-empty">
            <FontAwesomeIcon icon={faBookOpen} className="suggested-blogs-empty-icon" />
            <p>No suggested blogs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedBlogs;
