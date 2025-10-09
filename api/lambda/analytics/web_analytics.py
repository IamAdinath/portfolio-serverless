import json
import boto3
from datetime import datetime, timedelta
from typing import Dict, List, Any
import os

def lambda_handler(event, context):
    """
    AWS Lambda handler for web analytics data
    """
    try:
        # Get query parameters
        query_params = event.get('queryStringParameters') or {}
        date_range = query_params.get('range', '7d')
        
        # Parse date range
        days = parse_date_range(date_range)
        
        # Generate analytics data
        analytics_data = generate_analytics_data(days)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps(analytics_data)
        }
        
    except Exception as e:
        print(f"Error in web analytics: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def parse_date_range(date_range: str) -> int:
    """Parse date range string to number of days"""
    range_map = {
        '1d': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90
    }
    return range_map.get(date_range, 7)

def generate_analytics_data(days: int) -> Dict[str, Any]:
    """
    Generate analytics data for the specified number of days
    In a real implementation, this would query your analytics database
    """
    
    # Base metrics that scale with time range
    base_daily_views = 1800
    base_daily_visitors = 1200
    
    total_views = base_daily_views * days
    total_visitors = int(base_daily_visitors * days * 0.85)  # Some visitors return
    
    # Generate daily stats
    daily_stats = []
    end_date = datetime.now()
    
    for i in range(days):
        date = end_date - timedelta(days=days-1-i)
        # Add some randomness to make it look realistic
        daily_views = int(base_daily_views * (0.8 + 0.4 * (i % 7) / 6))
        daily_visitors = int(daily_views * 0.7)
        
        daily_stats.append({
            'date': date.strftime('%Y-%m-%d'),
            'views': daily_views,
            'visitors': daily_visitors
        })
    
    # Calculate trends (mock positive/negative trends)
    trends = {
        'pageViews': {'value': 12.5, 'trend': 'up'},
        'visitors': {'value': 8.3, 'trend': 'up'},
        'sessionDuration': {'value': 5.2, 'trend': 'down'},
        'bounceRate': {'value': 3.1, 'trend': 'up'}
    }
    
    # Top pages (would come from actual analytics)
    top_pages = [
        {'path': '/blog/react-best-practices', 'views': int(total_views * 0.18), 'title': 'React Best Practices'},
        {'path': '/blog/javascript-tips', 'views': int(total_views * 0.15), 'title': 'JavaScript Tips & Tricks'},
        {'path': '/blog/web-performance', 'views': int(total_views * 0.13), 'title': 'Web Performance Optimization'},
        {'path': '/portfolio', 'views': int(total_views * 0.11), 'title': 'Portfolio'},
        {'path': '/blog/css-grid-guide', 'views': int(total_views * 0.10), 'title': 'CSS Grid Complete Guide'},
    ]
    
    # Traffic sources (would come from actual analytics)
    traffic_sources = [
        {'source': 'Organic Search', 'visitors': int(total_visitors * 0.506), 'percentage': 50.6},
        {'source': 'Direct', 'visitors': int(total_visitors * 0.25), 'percentage': 25.0},
        {'source': 'Social Media', 'visitors': int(total_visitors * 0.15), 'percentage': 15.0},
        {'source': 'Referral', 'visitors': int(total_visitors * 0.094), 'percentage': 9.4},
    ]
    
    return {
        'totalPageViews': total_views,
        'uniqueVisitors': total_visitors,
        'avgSessionDuration': '3m 42s',
        'bounceRate': '42.3%',
        'topPages': top_pages,
        'trafficSources': traffic_sources,
        'dailyStats': daily_stats,
        'trends': trends
    }