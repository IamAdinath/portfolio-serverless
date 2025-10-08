import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faEye,
  faUsers,
  faClock,
  faShare,
  faComment,
  faChartLine,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { usePageTitle } from '../common/usePageTitle';
import { useToast } from '../common/ToastProvider';
import { GetBlogStats } from '../common/userAPI';
import './BlogStats.css';

interface BlogStatsData {
  blogId: string;
  title: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  metrics: {
    totalViews: number;
    uniqueVisitors: number;
    avgReadTime: string;
    bounceRate: string;
    socialShares: number;
    comments: number;
  };
  performance: {
    viewsThisWeek: number;
    viewsThisMonth: number;
    topReferrers: Array<{
      source: string;
      visits: number;
    }>;
  };
}

const BlogStats: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [stats, setStats] = useState<BlogStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  usePageTitle(stats ? `Stats - ${stats.title}` : 'Blog Stats');

  useEffect(() => {
    if (blogId) {
      fetchStats();
    }
  }, [blogId]);

  const fetchStats = async () => {
    if (!blogId) return;
    
    try {
      setLoading(true);
      const statsData = await GetBlogStats(blogId);
      setStats(statsData);
    } catch (error: any) {
      console.error('Failed to fetch blog stats:', error);
      
      // Check if it's a circuit breaker error
      if (error.message?.includes('temporarily blocked')) {
        addToast('error', 'Too many failed requests. Please reload the page to try again.');
      } else {
        addToast('error', 'Failed to load blog statistics');
      }
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-stats">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="blog-stats">
        <div className="error-container">
          <p>Blog statistics not found</p>
          <button onClick={() => navigate('/admin')} className="btn-back">
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-stats">
      <div className="stats-header">
        <button onClick={() => navigate('/admin')} className="btn-back">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Admin
        </button>
        <div className="stats-title">
          <h1>{stats.title}</h1>
          <div className="stats-meta">
            <span className={`status-badge ${stats.status}`}>{stats.status}</span>
            <span className="date-info">
              <FontAwesomeIcon icon={faCalendar} />
              {stats.publishedAt ? `Published ${formatDate(stats.publishedAt)}` : `Created ${formatDate(stats.createdAt)}`}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {/* Key Metrics */}
        <div className="stats-card">
          <div className="card-header">
            <h3>Key Metrics</h3>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <FontAwesomeIcon icon={faEye} className="metric-icon views" />
              <div className="metric-content">
                <div className="metric-value">{stats.metrics.totalViews.toLocaleString()}</div>
                <div className="metric-label">Total Views</div>
              </div>
            </div>
            <div className="metric-item">
              <FontAwesomeIcon icon={faUsers} className="metric-icon visitors" />
              <div className="metric-content">
                <div className="metric-value">{stats.metrics.uniqueVisitors.toLocaleString()}</div>
                <div className="metric-label">Unique Visitors</div>
              </div>
            </div>
            <div className="metric-item">
              <FontAwesomeIcon icon={faClock} className="metric-icon time" />
              <div className="metric-content">
                <div className="metric-value">{stats.metrics.avgReadTime}</div>
                <div className="metric-label">Avg Read Time</div>
              </div>
            </div>
            <div className="metric-item">
              <FontAwesomeIcon icon={faShare} className="metric-icon shares" />
              <div className="metric-content">
                <div className="metric-value">{stats.metrics.socialShares}</div>
                <div className="metric-label">Social Shares</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="stats-card">
          <div className="card-header">
            <h3>Performance Trends</h3>
          </div>
          <div className="performance-metrics">
            <div className="performance-item">
              <div className="performance-label">Views This Week</div>
              <div className="performance-value">{stats.performance.viewsThisWeek}</div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Views This Month</div>
              <div className="performance-value">{stats.performance.viewsThisMonth}</div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Bounce Rate</div>
              <div className="performance-value">{stats.metrics.bounceRate}</div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="stats-card">
          <div className="card-header">
            <h3>Traffic Sources</h3>
          </div>
          <div className="referrers-list">
            {stats.performance.topReferrers.map((referrer, index) => (
              <div key={index} className="referrer-item">
                <div className="referrer-source">{referrer.source}</div>
                <div className="referrer-visits">{referrer.visits} visits</div>
                <div className="referrer-bar">
                  <div 
                    className="referrer-fill" 
                    style={{ 
                      width: `${(referrer.visits / stats.performance.topReferrers[0].visits) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement */}
        <div className="stats-card">
          <div className="card-header">
            <h3>Engagement</h3>
          </div>
          <div className="engagement-metrics">
            <div className="engagement-item">
              <FontAwesomeIcon icon={faComment} className="engagement-icon" />
              <div className="engagement-content">
                <div className="engagement-value">{stats.metrics.comments}</div>
                <div className="engagement-label">Comments</div>
              </div>
            </div>
            <div className="engagement-item">
              <FontAwesomeIcon icon={faChartLine} className="engagement-icon" />
              <div className="engagement-content">
                <div className="engagement-value">
                  {((stats.metrics.uniqueVisitors / stats.metrics.totalViews) * 100).toFixed(1)}%
                </div>
                <div className="engagement-label">Return Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStats;