import React from 'react';
import { usePageTitle } from '../common/usePageTitle';
type BlogProps = {
  id: number;
  title: string;
  content: string;
  author: string;
};

const Blog: React.FC<BlogProps> = ({ title, content, author }) => {
  usePageTitle(`${title}`);
  return (
    <div className="blog-post">
      <h2>{title}</h2>
      <p>{content}</p>
      <p><em>by {author}</em></p>
    </div>
  );
};

export default Blog;
