import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageTitle } from '../common/usePageTitle';
import { GetBlogPostById } from '../common/userAPI';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  reading_time: number;
  status: string;
  images: string[];
  tags: string[];
}

const Blog: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();

  const [blog, setBlog] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageTitle(blog ? blog.title : 'Loading Blog...');

  useEffect(() => {
    if (!blogId) {
      setError('Blog ID is missing.');
      setLoading(false);
      return;
    }

    const fetchBlogData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await GetBlogPostById(blogId);
        console.log('Fetched blog data:', data);

        if (data && typeof data === 'object' && data.id) {
          setBlog(data);
        } else {
          throw new Error('Blog post not found or API response has an unexpected format.');
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId]); 

  if (loading) {
    return <div className="common-container">Loading...</div>;
  }

  if (error) {
    return <div className="common-container error-message">{error}</div>;
  }

  if (!blog) {
    return <div className="common-container">Blog post not found.</div>;
  }

  const displayDate = new Date(blog.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="blog-post-container common-container">
      <h1 className="blog-post-title">{blog.title}</h1>
      <p className="blog-post-meta">
        By {blog.author} on {displayDate}
      </p>
      <div 
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </div>
  );
};

export default Blog;