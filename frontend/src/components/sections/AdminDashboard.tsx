import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faEye, 
  faPlus, 
  faSearch,
  faFilter,
  faCalendar,
  faUser,
  faTags
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/ToastProvider';
import { usePageTitle } from '../common/usePageTitle';
import { GetBlogPosts, DeleteBlogPost } from '../common/userAPI';
import { BlogPostData } from '../../types';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  usePageTitle('Admin Dashboard');
  
  const [blogs, setBlogs] = useState<BlogPostData[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchBlogs();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogData = await GetBlogPosts();
      setBlogs(blogData || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      addToast('error', 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBlogs = () => {
    let filtered = [...blogs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'date':
        default:
          const dateA = new Date(a.published_at || a.created_at).getTime();
          const dateB = new Date(b.published_at || b.created_at).getTime();
          comparison = dateA - dateB;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredBlogs(filtered);
  };

  const handleDelete = async (blogId: string, title: string) => {
    // Simple confirmation - in a real app, you'd want a proper modal
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      await DeleteBlogPost(blogId);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      addToast('success', `"${title}" deleted successfully`);
    } catch (error) {
      console.error('Failed to delete blog:', error);
      addToast('error', 'Failed to delete blog. Please try again.');
    }
  };

  const handleEdit = (blogId: string) => {
    navigate(`/writer?id=${blogId}`);
  };

  const handleView = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  const handleNewBlog = () => {
    navigate('/writer');
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

  if (loading) {
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

      <div className="admin-controls">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'status')}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
          
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="blogs-table">
        {filteredBlogs.length === 0 ? (
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
              {filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="blog-title-cell">
                    <div className="blog-title">{blog.title}</div>
                    <div className="blog-preview">
                      {blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </div>
                  </td>
                  <td>{getStatusBadge(blog.status)}</td>
                  <td className="date-cell">
                    <FontAwesomeIcon icon={faCalendar} className="date-icon" />
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
    </div>
  );
};

export default AdminDashboard;