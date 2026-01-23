import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faEye,
  faPlus,
  faChartLine,
  faChartBar,
  faUpload,
  faFileAlt,
  faCog,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/ToastProvider';
import { usePageTitle } from '../common/usePageTitle';
import { useConfirmation } from '../../hooks/useConfirmationModal';
import { GetBlogPosts, DeleteBlogPost, UploadProfileImage, UploadResume } from '../common/apiService';
import { BlogPostData } from '../../types';
import ErrorBoundary from '../common/ErrorBoundary';
import ConfirmationModal from '../common/ConfirmationModal';
import './AdminDashboardPage.css';

const AdminDashboardPage: React.FC = () => {
  usePageTitle('Admin Dashboard');

  const [blogs, setBlogs] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs' | 'files'>('overview');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const { isAuthenticated } = useAuth();
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
    console.log('Delete button clicked:', { blogId, title });
    showConfirmation({
      title: 'Delete Blog Post',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        console.log('Confirm button clicked, deleting blog:', blogId);
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

  const handleViewAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast('error', 'Please select a PDF file for resume');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      addToast('error', 'Resume file size must be less than 5MB');
      return;
    }

    try {
      setUploadingResume(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Content = reader.result as string;
          const base64Data = base64Content.split(',')[1]; // Remove data:application/pdf;base64, prefix

          await UploadResume(base64Data);
          addToast('success', 'Resume uploaded successfully');
        } catch (error) {
          console.error('Failed to upload resume:', error);
          addToast('error', 'Failed to upload resume. Please try again.');
        } finally {
          setUploadingResume(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to process resume file:', error);
      addToast('error', 'Failed to process resume file');
      setUploadingResume(false);
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit (note: base64 encoding adds ~33% overhead)
      addToast('error', 'Image file size must be less than 2MB. Please compress the image before uploading.');
      return;
    }

    try {
      setUploadingProfile(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Content = reader.result as string;
          const base64Data = base64Content.split(',')[1]; // Remove data:image/...;base64, prefix

          await UploadProfileImage(base64Data, file.type);
          addToast('success', 'Profile image uploaded successfully');
        } catch (error) {
          console.error('Failed to upload profile image:', error);
          addToast('error', 'Failed to upload profile image. Please try again.');
        } finally {
          setUploadingProfile(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to process profile image:', error);
      addToast('error', 'Failed to process profile image');
      setUploadingProfile(false);
    }
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
            <h1>
              <FontAwesomeIcon icon={faCog} />
              Admin Dashboard
            </h1>
            <p>Manage your portfolio and content</p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-nav">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FontAwesomeIcon icon={faChartBar} />
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <FontAwesomeIcon icon={faEdit} />
            Blog Management
          </button>
          <button
            className={`nav-tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            <FontAwesomeIcon icon={faUpload} />
            File Management
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faEdit} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{blogs.length}</div>
                  <div className="stat-label">Total Blogs</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faEye} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{blogs.filter(b => b.status === 'published').length}</div>
                  <div className="stat-label">Published</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faFileAlt} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{blogs.filter(b => b.status === 'draft').length}</div>
                  <div className="stat-label">Drafts</div>
                </div>
              </div>
            </div>

            <div className="admin-quick-actions">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={handleNewBlog}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Create New Blog</span>
                </button>
                <button className="quick-action-btn" onClick={handleViewAnalytics}>
                  <FontAwesomeIcon icon={faChartBar} />
                  <span>View Analytics</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab('files')}>
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Manage Files</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab('blogs')}>
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Manage Blogs</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Management Tab */}
        {activeTab === 'blogs' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Blog Management</h3>
              <button className="btn-new-blog" onClick={handleNewBlog}>
                <FontAwesomeIcon icon={faPlus} />
                New Blog
              </button>
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Delete button raw click event');
                              handleDelete(blog.id, blog.title);
                            }}
                            title="Delete"
                            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
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
          </div>
        )}

        {/* File Management Tab */}
        {activeTab === 'files' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>File Management</h3>
              <p>Upload and manage your resume and profile image</p>
            </div>

            <div className="file-management-grid">
              {/* Resume Upload */}
              <div className="file-upload-card">
                <div className="file-upload-header">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <h4>Resume</h4>
                </div>
                <div className="file-upload-content">
                  <p>Upload your latest resume (PDF format, max 5MB)</p>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`file-upload-btn ${uploadingResume ? 'uploading' : ''}`}
                    >
                      <FontAwesomeIcon icon={uploadingResume ? faUpload : faUpload} />
                      {uploadingResume ? 'Uploading...' : 'Choose Resume File'}
                    </label>
                  </div>
                  <div className="file-info">
                    <small>Supported format: PDF • Max size: 5MB</small>
                  </div>
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="file-upload-card">
                <div className="file-upload-header">
                  <FontAwesomeIcon icon={faImage} />
                  <h4>Profile Image</h4>
                </div>
                <div className="file-upload-content">
                  <p>Upload your profile picture (Image format, max 2MB)</p>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      disabled={uploadingProfile}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="profile-upload"
                      className={`file-upload-btn ${uploadingProfile ? 'uploading' : ''}`}
                    >
                      <FontAwesomeIcon icon={uploadingProfile ? faUpload : faImage} />
                      {uploadingProfile ? 'Uploading...' : 'Choose Image File'}
                    </label>
                  </div>
                  <div className="file-info">
                    <small>Supported formats: JPG, PNG, GIF • Max size: 2MB</small>
                  </div>
                </div>
              </div>
            </div>
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

export default AdminDashboardPage;