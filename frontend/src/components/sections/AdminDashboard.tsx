import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faEye,
  faPlus,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/ToastProvider';
import { usePageTitle } from '../common/usePageTitle';
import { useConfirmation } from '../../hooks/useConfirmation';
import { GetBlogPosts, DeleteBlogPost } from '../common/userAPI';
import { BlogPostData } from '../../types';
import ErrorBoundary from '../common/ErrorBoundary';
import ConfirmationModal from '../common/ConfirmationModal';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  usePageTitle('Admin Dashboard');

  const [blogs, setBlogs] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { confirmationState, showConfirmation, hideConfirmation } = useConfirmation();

  const fetchBlogs = useCallback(async (pageToken?: string, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await GetBlogPosts(10, pageToken, 'all');

      if (append) {
        setBlogs(prev => [...prev, ...response.blogs]);
      } else {
        setBlogs(response.blogs);
      }

      setHasMore(response.hasMore);
      setNextPageToken(response.nextPageToken);
    } catch (error: any) {
      console.error('Failed to fetch blogs:', error);
      setError(error.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchBlogs();
  }, [isAuthenticated, navigate, fetchBlogs]);

  const handleDelete = (blogId: string, title: string) => {
    showConfirmation({
      title: 'Delete Blog Post',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await DeleteBlogPost(blogId);
          setBlogs(prev => prev.filter(blog => blog.id !== blogId));
          addToast('success', `"${title}" deleted successfully`);
        } catch (error) {
          console.error('Failed to delete blog:', error);
          addToast('error', 'Failed to delete blog. Please try again.');
        } finally {
          hideConfirmation();
        }
      }
    });
  };

  const handleEdit = (blogId: string) => {
    navigate(`/writer?id=${blogId}`);
  };

  const handleView = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  const handleViewStats = (blogId: string) => {
    navigate(`/admin/stats/${blogId}`);
  };

  const handleNewBlog = () => {
    navigate('/writer');
  };

  const handleLoadMore = () => {
    if (hasMore && nextPageToken && !loading) {
      fetchBlogs(nextPageToken, true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClass = status === 'published' ? 'status-published' : 'status-draft';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  // Show error state
  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && blogs.length === 0) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name || user?.username}</p>
          </div>
          <button className="btn-new-blog" onClick={handleNewBlog}>
            <FontAwesomeIcon icon={faPlus} />
            New Blog
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{blogs.length}</div>
            <div className="stat-label">Total Blogs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{blogs.filter(b => b.status === 'published').length}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{blogs.filter(b => b.status === 'draft').length}</div>
            <div className="stat-label">Drafts</div>
          </div>
        </div>

        <div className="blogs-table">
          {blogs.length === 0 ? (
            <div className="empty-state">
              <p>No blogs found</p>
              <button className="btn-primary" onClick={handleNewBlog}>
                Create your first blog
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="blog-title-cell">
                      <div className="blog-title">{blog.title}</div>
                      <div className="blog-preview">
                        {blog.content?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No content'}...
                      </div>
                    </td>
                    <td>{getStatusBadge(blog.status)}</td>
                    <td className="date-cell">
                      {formatDate(blog.published_at || blog.created_at)}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleView(blog.id)}
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="action-btn stats-btn"
                        onClick={() => handleViewStats(blog.id)}
                        title="View Stats"
                      >
                        <FontAwesomeIcon icon={faChartLine} />
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(blog.id)}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(blog.id, blog.title)}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {blogs.length > 0 && hasMore && (
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {blogs.length} blogs
            </div>
            <button
              className="btn-load-more"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        <ConfirmationModal
          isOpen={confirmationState.isOpen}
          title={confirmationState.title}
          message={confirmationState.message}
          confirmText={confirmationState.confirmText}
          cancelText={confirmationState.cancelText}
          type={confirmationState.type}
          onConfirm={confirmationState.onConfirm}
          onCancel={hideConfirmation}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;