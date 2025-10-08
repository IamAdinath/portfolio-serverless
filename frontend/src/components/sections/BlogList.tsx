// src/components/sections/BlogList.tsx

import React, { useEffect, useState } from 'react';
import BlogCard from '../common/BlogCard';
import './BlogList.css';
import { usePageTitle } from '../common/usePageTitle';
import { GetAllPublishedBlogs } from '../common/userAPI';
import { Blog, DateFormatOptions } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faCalendar, faClock, faUser } from '@fortawesome/free-solid-svg-icons';

// --- NEW HELPER FUNCTIONS ---

/**
 * Calculates the estimated reading time of a piece of text.
 * @param htmlContent The HTML content of the blog.
 * @returns Estimated minutes to read.
 */
const calculateReadTime = (htmlContent: string): number => {
  // Strip HTML tags to count only the words
  const text = htmlContent.replace(/<[^>]+>/g, '');
  const wordsPerMinute = 225; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
};

/**
 * Formats a date string or Date object into a more readable format.
 * @param dateString The ISO date string from the database.
 * @returns A formatted date string like "Dec 25, 2023".
 */
const formatPublishDate = (dateString: string): string => {
  const options: DateFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const BlogList: React.FC = () => {
  usePageTitle('Blogs');

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await GetAllPublishedBlogs();
        setBlogs(data);
      } catch (err: any) {
        // Check if it's a circuit breaker error
        if (err.message?.includes('temporarily blocked')) {
          setError('Too many failed requests. Please reload the page to try again.');
        } else {
          setError(err.message || 'Failed to load blogs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="bloglist-main-container">
        <div className="bloglist-loading">
          <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.2rem' }} />
          Loading blogs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bloglist-main-container">
        <div className="bloglist-error">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalBlogs = blogs.length;
  const totalReadTime = blogs.reduce((total, blog) => total + calculateReadTime(blog.content), 0);
  const uniqueAuthors = new Set(blogs.map(blog => blog.author)).size;

  return (
    <div className="bloglist-main-container">
      {/* Header Section */}
      <div className="bloglist-header">
        <h1>
          <FontAwesomeIcon icon={faBlog} style={{ marginRight: '15px', color: '#2d2d2d' }} />
          Blog Posts
        </h1>
        <p>Discover insights, tutorials, and thoughts on web development, cloud architecture, and technology trends.</p>
      </div>

      {/* Stats Section */}
      {blogs.length > 0 && (
        <div className="bloglist-stats">
          <div className="bloglist-stat">
            <span className="bloglist-stat-number">{totalBlogs}</span>
            <span className="bloglist-stat-label">Total Posts</span>
          </div>
          <div className="bloglist-stat">
            <span className="bloglist-stat-number">{totalReadTime}</span>
            <span className="bloglist-stat-label">Minutes of Content</span>
          </div>
          <div className="bloglist-stat">
            <span className="bloglist-stat-number">{uniqueAuthors}</span>
            <span className="bloglist-stat-label">Authors</span>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="bloglist-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => {
            const readTime = calculateReadTime(blog.content);
            const publishDate = blog.published_at ? formatPublishDate(blog.published_at) : "Date not available";
            const thumbnail = blog.images ? blog.images : undefined;
            const tags = blog.tags ? blog.tags : [];

            return (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={blog.content}
                author={blog.author}
                publishDate={publishDate}
                readTimeInMinutes={readTime}
                thumbnail={thumbnail}
                tags={tags}
              />
            );
          })
        ) : (
          <div className="bloglist-no-blogs">
            <FontAwesomeIcon icon={faBlog} style={{ fontSize: '3rem', marginBottom: '20px', color: '#cbd5e0' }} />
            <p>No blogs found. Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;