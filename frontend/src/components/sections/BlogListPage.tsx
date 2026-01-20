// src/components/sections/BlogListPage.tsx

import React, { useEffect, useState } from 'react';
import BlogCard from '../common/BlogCard';
import './BlogListPage.css';
import { usePageTitle } from '../common/usePageTitle';
import SEOHead from '../common/SEOHead';
import { GetAllPublishedBlogs } from '../common/apiService';
import { Blog, DateFormatOptions } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faClock, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import FeaturedMediumArticles from './FeaturedMediumArticles';

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

const BlogListPage: React.FC = () => {
  usePageTitle('Blogs');

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 7;

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

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <SEOHead
        title="Blog Posts - Adinath Gore | Tech Insights & Tutorials"
        description="Explore Adinath Gore's blog featuring insights on web development, cloud architecture, React, Node.js, AWS, and modern technology trends. Learn from practical tutorials and industry experiences."
        keywords={[
          'Adinath Gore Blog',
          'Web Development Blog',
          'React Tutorials',
          'Node.js Articles',
          'AWS Cloud Blog',
          'Software Engineering',
          'Tech Insights',
          'Programming Tutorials',
          'Full Stack Development'
        ]}
        url="/blogs"
        type="website"
      />
      <div className="bloglist-main-container">
      {/* Header Section */}
      <div className="bloglist-header">
        <h1>
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
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => {
            const readTime = calculateReadTime(blog.content);
            const publishDate = blog.published_at ? formatPublishDate(blog.published_at) : "Date not available";
            
            // Extract first image from images field
            let thumbnail: string | undefined = undefined;
            if (blog.images) {
              try {
                // Try to parse as JSON array
                const imagesArray = JSON.parse(blog.images);
                if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                  thumbnail = imagesArray[0];
                }
              } catch {
                // If not JSON, treat as single URL string
                thumbnail = blog.images;
              }
            }
            
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bloglist-pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bloglist-pagination-btn"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`bloglist-pagination-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bloglist-pagination-btn"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Featured Medium Articles */}
      <FeaturedMediumArticles className="bloglist-featured-spacing" />
    </div>
    </>
  );
};

export default BlogListPage;