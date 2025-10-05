// src/components/sections/BlogList.tsx

import React, { useEffect, useState } from 'react';
import BlogCard from '../common/BlogCard';
import '../common/common.css';
import { usePageTitle } from '../common/usePageTitle';
import { GetBlogPosts } from '../common/userAPI';
import { Blog, DateFormatOptions } from '../../types';

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
        const data = await GetBlogPosts();
        setBlogs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="common-container"><p>Loading blogs...</p></div>;
  }

  if (error) {
    return <div className="common-container"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="common-container">
      {blogs.length > 0 ? (
        blogs.map((blog) => {
          const readTime = calculateReadTime(blog.content);
          const publishDate = blog.published_at ? formatPublishDate(blog.published_at) : "Date not available";
          const thumbnail = blog.images ? blog.images:  undefined;
          const tags = blog.tags? blog.tags : [];

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
        <p className="text-gray-500">No blogs found.</p>
      )}
    </div>
  );
};

export default BlogList;