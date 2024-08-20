import React from 'react';
import './SuggestedBlogs.css'; // Import the CSS file for styling

type Blog = {
  id: number;
  title: string;
  author: string;
  thumbnail: string; // URL to the thumbnail image
};

type SuggestedBlogsProps = {
  suggestions: Blog[];
};

const SuggestedBlogs: React.FC<SuggestedBlogsProps> = ({ suggestions }) => {
  return (
    <div className="suggested-blogs-footer">
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
