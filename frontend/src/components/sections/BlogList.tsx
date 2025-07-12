import React, { useEffect, useState } from 'react';
import BlogCard from '../common/BlogCard';
import '../common/common.css';
import { usePageTitle } from '../common/usePageTitle';
import { GetBlogPosts } from '../common/userAPI';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  [key: string]: any;
}

const BlogList: React.FC = () => {
  usePageTitle('Blogs');

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await GetBlogPosts();
        console.log('Fetched blogs:', data);
        setBlogs(data);
      } catch (err: any) {
        console.error('Error fetching blogs:', err);
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="common-container">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="common-container">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="common-container">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            content={blog.content}
            author={blog.author}
            thumbnail={blog.images}
          />
        ))
      ) : (
        <p className="text-gray-500">No blogs found.</p>
      )}
    </div>
  );
};

export default BlogList;
