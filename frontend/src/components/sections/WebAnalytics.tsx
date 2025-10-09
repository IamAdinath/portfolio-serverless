import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faUsers,
  faClock,
  faChartLine,
  faGlobe,
  faCalendarAlt,
  faArrowUp,
  faArrowDown,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../common/ToastProvider';
import { usePageTitle } from '../common/usePageTitle';
import { GetWebAnalytics } from '../common/userAPI';
import ErrorBoundary from '../common/ErrorBoundary';
import './WebAnalytics.css';

interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{
    path: string;
    views: number;
    title: string;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
  trends: {
    pageViews: { value: number; trend: 'up' | 'down' | 'neutral' };
    visitors: { value: number; trend: 'up' | 'down' | 'neutral' };
    sessionDuration: { value: number; trend: 'up' | 'down' | 'neutral' };
    bounceRate: { value: number; trend: 'up' | 'down' | 'neutral' };
  };
}

const WebAnalytics: React.FC = () => {
  usePageTitle('Web Analytics');
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const { addToast } = useToast();

  const fetchAnalyticsData = async (range: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real analytics data, fallback to mock data if API not available
      try {
        const response = await GetWebAnalytics(range);
        setAnalyticsData(response);
        addToast('success', 'Real analytics data loaded');
      } catch (apiError) {
        console.warn('Analytics API not available, using mock data:', apiError);
        addToast('info', 'Using demo data - deploy analytics infrastructure for real data');
        
        // Mock data fallback
        const mockData: AnalyticsData = {
          totalPageViews: 12547,
          uniqueVisitors: 8932,
          avgSessionDuration: '3m 42s',
          bounceRate: '42.3%',
          topPages: [
            { path: '/blog/react-best-practices', views: 2341, title: 'React Best Practices' },
            { path: '/blog/javascript-tips', views: 1876, title: 'JavaScript Tips & Tricks' },
            { path: '/blog/web-performance', views: 1654, title: 'Web Performance Optimization' },
            { path: '/portfolio', views: 1432, title: 'Portfolio' },
            { path: '/blog/css-grid-guide', views: 1287, title: 'CSS Grid Complete Guide' },
          ],
          trafficSources: [
            { source: 'Organic Search', visitors: 4521, percentage: 50.6 },
            { source: 'Direct', visitors: 2234, percentage: 25.0 },
            { source: 'Social Media', visitors: 1342, percentage: 15.0 },
            { source: 'Referral', visitors: 835, percentage: 9.4 },
          ],
          dailyStats: [
            { date: '2024-01-01', views: 1234, visitors: 876 },
            { date: '2024-01-02', views: 1456, visitors: 1023 },
            { date: '2024-01-03', views: 1678, visitors: 1187 },
            { date: '2024-01-04', views: 1543, visitors: 1098 },
            { date: '2024-01-05', views: 1789, visitors: 1234 },
            { date: '2024-01-06', views: 1987, visitors: 1456 },
            { date: '2024-01-07', views: 2134, visitors: 1567 },
          ],
          trends: {
            pageViews: { value: 12.5, trend: 'up' },
            visitors: { value: 8.3, trend: 'up' },
            sessionDuration: { value: 5.2, trend: 'down' },
            bounceRate: { value: 3.1, trend: 'up' },
          },
        };

        setAnalyticsData(mockData);
      }
    } catch (error: any) {
      console.error('Failed to fetch analytics data:', error);
      setError(error.message || 'Failed to load analytics data');
      addToast('error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(dateRange);
  }, [dateRange]);

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <FontAwesomeIcon icon={faArrowUp} className="trend-up" />;
      case 'down':
        return <FontAwesomeIcon icon={faArrowDown} className="trend-down" />;
      default:
        return <FontAwesomeIcon icon={faMinus} className="trend-neutral" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="web-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="web-analytics">
        <div className="error-container">
          <h3>Unable to load analytics</h3>
          <p>{error}</p>
          <button onClick={() => fetchAnalyticsData(dateRange)} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="web-analytics">
        <div className="analytics-header">
          <div className="analytics-title">
            <h2>
              <FontAwesomeIcon icon={faChartLine} />
              Web Analytics
            </h2>
            <p>Track your website performance and visitor insights</p>
          </div>
          <div className="date-range-selector">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="analytics-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faEye} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{formatNumber(analyticsData.totalPageViews)}</div>
              <div className="metric-label">Page Views</div>
              <div className="metric-trend">
                {getTrendIcon(analyticsData.trends.pageViews.trend)}
                <span>{analyticsData.trends.pageViews.value}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{formatNumber(analyticsData.uniqueVisitors)}</div>
              <div className="metric-label">Unique Visitors</div>
              <div className="metric-trend">
                {getTrendIcon(analyticsData.trends.visitors.trend)}
                <span>{analyticsData.trends.visitors.value}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{analyticsData.avgSessionDuration}</div>
              <div className="metric-label">Avg. Session Duration</div>
              <div className="metric-trend">
                {getTrendIcon(analyticsData.trends.sessionDuration.trend)}
                <span>{analyticsData.trends.sessionDuration.value}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{analyticsData.bounceRate}</div>
              <div className="metric-label">Bounce Rate</div>
              <div className="metric-trend">
                {getTrendIcon(analyticsData.trends.bounceRate.trend)}
                <span>{analyticsData.trends.bounceRate.value}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="analytics-content">
          {/* Top Pages */}
          <div className="analytics-section">
            <h3>Top Pages</h3>
            <div className="top-pages-list">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.path} className="page-item">
                  <div className="page-rank">{index + 1}</div>
                  <div className="page-info">
                    <div className="page-title">{page.title}</div>
                    <div className="page-path">{page.path}</div>
                  </div>
                  <div className="page-views">
                    <div className="views-count">{formatNumber(page.views)}</div>
                    <div className="views-label">views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="analytics-section">
            <h3>Traffic Sources</h3>
            <div className="traffic-sources">
              {analyticsData.trafficSources.map((source) => (
                <div key={source.source} className="source-item">
                  <div className="source-info">
                    <div className="source-name">{source.source}</div>
                    <div className="source-visitors">{formatNumber(source.visitors)} visitors</div>
                  </div>
                  <div className="source-percentage">
                    <div className="percentage-bar">
                      <div
                        className="percentage-fill"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="percentage-text">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Stats Chart */}
        <div className="analytics-section full-width">
          <h3>
            <FontAwesomeIcon icon={faCalendarAlt} />
            Daily Statistics
          </h3>
          <div className="daily-stats-chart">
            <div className="chart-container">
              {analyticsData.dailyStats.map((stat, index) => {
                const maxViews = Math.max(...analyticsData.dailyStats.map(s => s.views));
                const height = (stat.views / maxViews) * 100;
                
                return (
                  <div key={stat.date} className="chart-bar">
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{ height: `${height}%` }}
                        title={`${stat.views} views, ${stat.visitors} visitors`}
                      ></div>
                    </div>
                    <div className="bar-label">
                      {new Date(stat.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color views"></div>
                <span>Page Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WebAnalytics;