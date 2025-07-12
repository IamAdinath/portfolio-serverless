import React from 'react';
import './BlogCard.css';

export interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  readTimeInMinutes: number;
  thumbnail?: string;
  tags: string[];
}

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
  return (
    <a href={`/blog/${id}`} className="blog-card-link">
      <article className="blog-card">
        <div className="blog-content-wrapper">
          <div className="author-details">
            {/* <span className="author-name">{author}</span> */}
          </div>
          <h2 className="blog-title">{title}</h2>
          <p className="blog-snippet">{contentSnippet}</p>
          <div className="blog-meta">
            <span>{publishDate}</span>
            <span className="meta-separator">·</span>
            <span>{readTimeInMinutes} min read</span>
            <span className="blog-tags">{tags.join(', ')}</span>
          </div>
        </div>
        {thumbnail && (
          <div className="thumbnail-container">
            <img src={thumbnail} alt={`Thumbnail for ${title}`} className="blog-thumbnail" />
          </div>
        )}
      </article>
    </a>
  );
};

export default BlogCard;