import React from 'react';
import './SuggestedBlogs.css';
import '../common/common.css';
import { SuggestedBlogsProps } from '../../types';

const SuggestedBlogs: React.FC<SuggestedBlogsProps> = ({ suggestions }) => {
  return (
    <div className="common-container">
      <h3>Suggested Blogs</h3>
      <div className="suggested-blogs-container">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="suggested-blogs-item">
            <img src={suggestion.thumbnail} alt={suggestion.title} className="suggested-blogs-thumbnail" />
            <h4 className="suggested-blogs-title">{suggestion.title}</h4>
            <p className="suggested-blogs-author">by {suggestion.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedBlogs;
