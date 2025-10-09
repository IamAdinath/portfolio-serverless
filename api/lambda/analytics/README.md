# Analytics Lambda Functions

This directory contains Lambda functions for web analytics functionality.

## Functions

### web_analytics.py
- **Purpose**: Provides web analytics data for the admin dashboard
- **Endpoint**: `/web-analytics`
- **Method**: GET
- **Authentication**: Required (Cognito)
- **Query Parameters**:
  - `range`: Date range for analytics (1d, 7d, 30d, 90d) - defaults to 7d

**Response Format**:
```json
{
  "totalPageViews": 12547,
  "uniqueVisitors": 8932,
  "avgSessionDuration": "3m 42s",
  "bounceRate": "42.3%",
  "topPages": [
    {
      "path": "/blog/react-best-practices",
      "views": 2341,
      "title": "React Best Practices"
    }
  ],
  "trafficSources": [
    {
      "source": "Organic Search",
      "visitors": 4521,
      "percentage": 50.6
    }
  ],
  "dailyStats": [
    {
      "date": "2024-01-01",
      "views": 1234,
      "visitors": 876
    }
  ],
  "trends": {
    "pageViews": { "value": 12.5, "trend": "up" },
    "visitors": { "value": 8.3, "trend": "up" },
    "sessionDuration": { "value": 5.2, "trend": "down" },
    "bounceRate": { "value": 3.1, "trend": "up" }
  }
}
```

## Implementation Notes

Currently, the analytics data is generated using mock data for demonstration purposes. In a production environment, you would:

1. **Integrate with real analytics services** like Google Analytics, AWS CloudWatch, or custom tracking
2. **Store analytics data** in DynamoDB or another database
3. **Implement real-time tracking** for page views, user sessions, etc.
4. **Add more sophisticated metrics** like conversion rates, user flows, etc.

## Future Enhancements

- Real-time analytics dashboard
- Custom event tracking
- A/B testing metrics
- User behavior analysis
- Performance monitoring integration