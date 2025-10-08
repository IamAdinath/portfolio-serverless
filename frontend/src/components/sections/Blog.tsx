import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../common/usePageTitle';
import { GetBlogPostById } from '../common/userAPI';
import { BlogPostData } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faClock, 
  faUser, 
  faArrowLeft, 
  faShare,
  faHeart,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import { 
  faLinkedin, 
  faTwitter, 
  faFacebook 
} from '@fortawesome/free-brands-svg-icons';
import './Blog.css';

const Blog: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const calculateReadTime = (content: string): number => {
    const text = content.replace(/<[^>]+>/g, '');
    const wordsPerMinute = 225;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="blog-reader-container">
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-reader-container">
        <div className="blog-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <Link to="/blogs" className="back-to-blogs-btn">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-reader-container">
        <div className="blog-not-found">
          <h2>Blog post not found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="back-to-blogs-btn">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(blog.content);
  const publishDate = formatDate(blog.published_at || blog.created_at);

  return (
    <div className="blog-reader-container">
      {/* Navigation */}
      <div className="blog-navigation">
        <Link to="/blogs" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Blogs
        </Link>
      </div>

      {/* Blog Header */}
      <header className="blog-header">
        <h1 className="blog-reader-title">{blog.title}</h1>
        
        <div className="blog-meta-info">
          <div className="blog-author-info">
            <div className="author-avatar">
              {blog.author.charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <span className="author-name">{blog.author}</span>
              <div className="blog-meta-items">
                <span className="meta-item">
                  <FontAwesomeIcon icon={faCalendar} />
                  {publishDate}
                </span>
                <span className="meta-separator">·</span>
                <span className="meta-item">
                  <FontAwesomeIcon icon={faClock} />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>

          <div className="blog-actions">
            <button 
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
              title="Like this post"
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button 
              className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              title="Bookmark this post"
            >
              <FontAwesomeIcon icon={faBookmark} />
            </button>
            <div className="share-dropdown">
              <button className="action-btn share-btn" title="Share this post">
                <FontAwesomeIcon icon={faShare} />
              </button>
              <div className="share-menu">
                <button onClick={() => shareOnSocial('twitter')}>
                  <FontAwesomeIcon icon={faTwitter} />
                  Twitter
                </button>
                <button onClick={() => shareOnSocial('linkedin')}>
                  <FontAwesomeIcon icon={faLinkedin} />
                  LinkedIn
                </button>
                <button onClick={() => shareOnSocial('facebook')}>
                  <FontAwesomeIcon icon={faFacebook} />
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Blog Content */}
      <article className="blog-content-wrapper">
        <div 
          className="blog-reader-content"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />
      </article>

      {/* Blog Footer */}
      <footer className="blog-footer">
        <div className="blog-footer-actions">
          <button 
            className={`footer-action-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <FontAwesomeIcon icon={faHeart} />
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            className={`footer-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <FontAwesomeIcon icon={faBookmark} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>

        <div className="blog-share-section">
          <p>Share this article:</p>
          <div className="share-buttons">
            <button 
              className="share-social-btn twitter"
              onClick={() => shareOnSocial('twitter')}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </button>
            <button 
              className="share-social-btn linkedin"
              onClick={() => shareOnSocial('linkedin')}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </button>
            <button 
              className="share-social-btn facebook"
              onClick={() => shareOnSocial('facebook')}
            >
              <FontAwesomeIcon icon={faFacebook} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;