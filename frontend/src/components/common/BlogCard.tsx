// BlogCard.tsx
import React from 'react';
import './BlogCard.css';

export interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  thumbnail?: string; // ✅ Optional thumbnail
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, content, author, thumbnail }) => {
  return (
    <div className="blog-card">
      {thumbnail && (
        <div className="thumbnail-container">
          <img src={thumbnail} alt={title} className="blog-thumbnail" />
        </div>
      )}
      <div className="blog-details">
        <h2 className="blog-title">{title}</h2>
        <p className="blog-content">{content}</p>
        <p className="blog-author">By {author}</p>
      </div>
    </div>
  );
};

export default BlogCard;
