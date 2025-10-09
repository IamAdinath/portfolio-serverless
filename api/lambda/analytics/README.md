# Real Analytics System Implementation

This directory contains a complete analytics tracking and reporting system for the portfolio website.

## Overview

The analytics system consists of:
1. **Client-side tracking** - Automatic page view and event tracking
2. **Data collection API** - Stores analytics events in DynamoDB
3. **Analytics dashboard** - Real-time analytics reporting
4. **Data processing** - Aggregates and analyzes collected data

## Architecture

### Client-Side Tracking (`frontend/src/utils/analytics.ts`)
- **Automatic page view tracking** for SPA navigation
- **Event tracking** for downloads, form submissions, clicks
- **Session management** with unique session IDs
- **User identification** for authenticated users
- **Privacy-focused** - only tracks in production

### Data Collection (`analytics_tracker.py`)
- **Event ingestion** via POST `/track-analytics`
- **DynamoDB storage** with TTL for data retention
- **Session tracking** with unique identifiers
- **User agent and referrer analysis**
- **IP-based visitor identification**

### Analytics Reporting (`web_analytics.py`)
- **Real-time dashboard** via GET `/web-analytics`
- **Date range filtering** (1d, 7d, 30d, 90d)
- **Key metrics calculation** (page views, unique visitors, etc.)
- **Top pages analysis** with view counts
- **Traffic source breakdown** (organic, direct, social, referral)
- **Daily statistics** with trend analysis

### Database Schema (`AnalyticsTable`)
```
Primary Key: id (String)
Attributes:
- timestamp: ISO datetime
- date: YYYY-MM-DD format
- hour: YYYY-MM-DD-HH format
- event_type: page_view, click, download, etc.
- page_path: URL path
- page_title: Page title
- user_agent: Browser information
- ip_address: Visitor IP (anonymized)
- referrer: Source URL
- session_id: Unique session identifier
- user_id: Authenticated user ID (optional)
- ttl: Auto-deletion timestamp (1 year)

Global Secondary Indexes:
- date_timestamp_index: For date range queries
- page_path_timestamp_index: For page-specific analytics
```

## Features

### Automatic Tracking
- **Page Views**: Every page navigation
- **Downloads**: Resume and file downloads
- **Form Submissions**: Blog publishing, contact forms
- **External Links**: Clicks on external links
- **Scroll Depth**: User engagement measurement
- **Session Duration**: Time spent on site

### Analytics Dashboard
- **Real-time Metrics**: Live data updates
- **Visual Charts**: Daily statistics with interactive charts
- **Top Content**: Most popular pages and posts
- **Traffic Analysis**: Source breakdown with percentages
- **Trend Indicators**: Growth/decline indicators
- **Date Filtering**: Flexible time range selection

### Privacy & Performance
- **Production Only**: No tracking in development
- **Session-based**: No persistent user tracking
- **Minimal Data**: Only essential analytics data
- **TTL Cleanup**: Automatic data expiration
- **Graceful Fallback**: Works without analytics API

## Deployment

### 1. Infrastructure
The CloudFormation template includes:
- `AnalyticsTable`: DynamoDB table with GSIs
- `AnalyticsTrackerLambda`: Event collection endpoint
- `WebAnalyticsLambda`: Dashboard data endpoint

### 2. Environment Variables
```yaml
ANALYTICS_TABLE: !Ref AnalyticsTable
```

### 3. Permissions
- **Tracker Lambda**: DynamoDB write access
- **Analytics Lambda**: DynamoDB read access
- **API Gateway**: CORS enabled for web requests

## Usage

### Client-Side Integration
```typescript
import { trackEvent, trackDownload, setUserId } from '../utils/analytics';

// Track custom events
trackEvent('button_click', { button_name: 'subscribe' });

// Track downloads
trackDownload('resume.pdf', 'pdf');

// Set user ID for authenticated tracking
setUserId('user123');
```

### API Endpoints

#### Track Event
```bash
POST /track-analytics
Content-Type: application/json

{
  "event_type": "page_view",
  "page_path": "/blog/my-post",
  "page_title": "My Blog Post",
  "referrer": "https://google.com",
  "session_id": "uuid-here"
}
```

#### Get Analytics
```bash
GET /web-analytics?range=7d
Authorization: Bearer <token>

Response:
{
  "totalPageViews": 12547,
  "uniqueVisitors": 8932,
  "avgSessionDuration": "3m 42s",
  "bounceRate": "42.3%",
  "topPages": [...],
  "trafficSources": [...],
  "dailyStats": [...],
  "trends": {...}
}
```

## Data Processing

### Real-time Aggregation
- **Page views**: Count of all page_view events
- **Unique visitors**: Distinct session_id count
- **Top pages**: Most viewed paths with titles
- **Traffic sources**: Referrer analysis and categorization
- **Daily stats**: Time-series data for charts

### Performance Optimization
- **GSI Queries**: Efficient date range filtering
- **Scan Fallback**: Full table scan for comprehensive data
- **Caching**: Client-side caching of analytics data
- **Pagination**: Handles large datasets efficiently

## Monitoring & Maintenance

### Key Metrics to Monitor
- **Event ingestion rate**: Events per minute/hour
- **API response times**: Dashboard load performance
- **Error rates**: Failed tracking attempts
- **Data retention**: TTL cleanup effectiveness

### Troubleshooting
1. **No data showing**: Check Lambda logs and DynamoDB writes
2. **Slow dashboard**: Optimize GSI queries or add caching
3. **High costs**: Adjust TTL or implement data sampling
4. **Privacy concerns**: Review data collection practices

## Future Enhancements

### Advanced Analytics
- **Conversion tracking**: Goal completion rates
- **User flows**: Navigation path analysis
- **A/B testing**: Experiment result tracking
- **Real-time alerts**: Anomaly detection
- **Custom dimensions**: Additional event properties

### Integration Options
- **Google Analytics**: Dual tracking setup
- **AWS CloudWatch**: Infrastructure metrics
- **ElasticSearch**: Advanced querying and visualization
- **Data export**: CSV/JSON export functionality

### Performance Improvements
- **Data aggregation**: Pre-computed daily/hourly stats
- **Streaming analytics**: Real-time processing with Kinesis
- **CDN integration**: CloudFront access log analysis
- **Machine learning**: Predictive analytics and insights

## Security Considerations

- **Data anonymization**: IP address hashing
- **Access control**: Admin-only analytics access
- **Rate limiting**: Prevent analytics spam
- **Data retention**: Automatic cleanup policies
- **GDPR compliance**: User consent and data deletion

This analytics system provides comprehensive insights while maintaining user privacy and system performance.