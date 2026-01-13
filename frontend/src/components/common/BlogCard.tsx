import React from 'react';
import './BlogCard.css';
import { Link } from 'react-router-dom';
import { BlogCardProps } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Helper function to create a clean text snippet from HTML content.
 * @param htmlString The raw HTML from the editor.
 * @param maxLength The desired maximum length of the snippet.
 * @returns A plain text string.
 */
const createSnippet = (htmlString: string, maxLength: number = 180): string => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const text = doc.body.textContent || "";
  
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Helper function to get author initials for avatar
 */
const getAuthorInitials = (author: string): string => {
  return author
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const BlogCard: React.FC<BlogCardProps> = ({ 
  id, 
  title, 
  content, 
  author, 
  publishDate,
  readTimeInMinutes,
  thumbnail,
  tags
}) => {
  const contentSnippet = createSnippet(content);
  const authorInitials = getAuthorInitials(author);
  
  return (
    <Link to={`/blog/${id}`} className="blogcard-link">
      <article className="blogcard-main">
        <div className="blogcard-content-wrapper">
          <div className="blogcard-author-details">
            <div className="blogcard-author-avatar">
              {authorInitials}
            </div>
            <span className="blogcard-author-name">{author}</span>
          </div>
          
          <h2 className="blogcard-title">{title}</h2>
          <p className="blogcard-snippet">{contentSnippet}</p>
          
          <div className="blogcard-meta">
            <div className="blogcard-meta-item">
              <FontAwesomeIcon icon={faCalendar} />
              <span>{publishDate}</span>
            </div>
            <span className="blogcard-meta-separator">·</span>
            <div className="blogcard-meta-item">
              <FontAwesomeIcon icon={faClock} />
              <span>{readTimeInMinutes} min read</span>
            </div>
          </div>

          {tags && tags.length > 0 && (
            <div className="blogcard-tags">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="blogcard-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="blogcard-read-more">
            Read More <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
        
        {thumbnail && (
          <div className="blogcard-thumbnail-container">
            <img 
              src={thumbnail} 
              alt={`Thumbnail for ${title}`} 
              className="blogcard-thumbnail"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </article>
    </Link>
  );
};

export default BlogCard;