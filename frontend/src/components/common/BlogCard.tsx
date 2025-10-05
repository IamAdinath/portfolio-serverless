import React from 'react';
import './BlogCard.css';
import { Link } from 'react-router-dom';
import { BlogCardProps } from '../../types';

/**
 * NEW: Helper function to create a clean text snippet from HTML content.
 * This is the critical fix to avoid rendering raw HTML tags.
 * @param htmlString The raw HTML from the editor.
 * @param maxLength The desired maximum length of the snippet.
 * @returns A plain text string.
 */
const createSnippet = (htmlString: string, maxLength: number = 150): string => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const text = doc.body.textContent || "";
  
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength).trim()}...`;
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
  console.log('blog id: ', id)
  return (
    <Link to={`/blog/${id}`} className="blog-card-link">
      <article className="blog-card">
        <div className="blog-content-wrapper">
          <div className="author-details">
            
            {/* To do 
            : Add author avatar or image here if available
            : Add Author name next to the avatar
            : Add a link to the author's profile page if available
             */}

          </div>
          <h2 className="blog-title">{title}</h2>
          <p className="blog-snippet">{contentSnippet}</p>
          <div className="blog-meta">
            <span>{publishDate}</span>
            <span className="meta-separator">·</span>
            <span>{readTimeInMinutes} min read</span>
            <span className="blog-tags">{tags?.join(', ') || ''}</span>
          </div>
        </div>
        {thumbnail && (
          <div className="thumbnail-container">
            <img src={thumbnail} alt={`Thumbnail for ${title}`} className="blog-thumbnail" />
          </div>
        )}
      </article>
    </Link>
  );
};

export default BlogCard;