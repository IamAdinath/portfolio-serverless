import json
import boto3
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any
import os
from collections import defaultdict, Counter
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    """
    AWS Lambda handler for web analytics data - uses real data from DynamoDB
    """
    
    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': ''
        }
    
    try:
        # Get DynamoDB table
        dynamodb = boto3.resource('dynamodb')
        analytics_table = dynamodb.Table(os.environ['ANALYTICS_TABLE'])
        
        # Get query parameters
        query_params = event.get('queryStringParameters') or {}
        date_range = query_params.get('range', '7d')
        
        # Parse date range
        days = parse_date_range(date_range)
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Query analytics data
        analytics_data = get_real_analytics_data(analytics_table, start_date, days)
        
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

def get_real_analytics_data(analytics_table, start_date: datetime, days: int) -> Dict[str, Any]:
    """
    Get real analytics data from DynamoDB
    """
    try:
        # Query analytics data for the date range
        start_date_str = start_date.strftime('%Y-%m-%d')
        end_date_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        # Scan the table for the date range (in production, use GSI for better performance)
        response = analytics_table.scan(
            FilterExpression=Attr('date').between(start_date_str, end_date_str) & 
                           Attr('event_type').eq('page_view')
        )
        
        items = response['Items']
        
        # Continue scanning if there are more items
        while 'LastEvaluatedKey' in response:
            response = analytics_table.scan(
                FilterExpression=Attr('date').between(start_date_str, end_date_str) & 
                               Attr('event_type').eq('page_view'),
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            items.extend(response['Items'])
        
        return process_analytics_data(items, days)
        
    except Exception as e:
        print(f"Error querying analytics data: {str(e)}")
        # Return empty data if there's an error
        return generate_empty_analytics_data(days)

def process_analytics_data(items: List[Dict], days: int) -> Dict[str, Any]:
    """
    Process raw analytics data into dashboard format
    """
    if not items:
        return generate_empty_analytics_data(days)
    
    # Calculate basic metrics
    total_page_views = len(items)
    unique_visitors = len(set(item.get('session_id', '') for item in items))
    
    # Calculate daily stats
    daily_stats = defaultdict(lambda: {'views': 0, 'visitors': set()})
    page_views = Counter()
    referrers = Counter()
    
    for item in items:
        date = item.get('date', '')
        session_id = item.get('session_id', '')
        page_path = item.get('page_path', '/')
        page_title = item.get('page_title', 'Unknown')
        referrer = item.get('referrer', '')
        
        # Daily stats
        daily_stats[date]['views'] += 1
        daily_stats[date]['visitors'].add(session_id)
        
        # Page views
        page_views[(page_path, page_title)] += 1
        
        # Referrers
        if referrer and referrer.strip():
            if 'google' in referrer.lower():
                referrers['Organic Search'] += 1
            elif any(social in referrer.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram']):
                referrers['Social Media'] += 1
            else:
                referrers['Referral'] += 1
        else:
            referrers['Direct'] += 1
    
    # Convert daily stats to list
    daily_stats_list = []
    for i in range(days):
        date = (datetime.now(timezone.utc) - timedelta(days=days-1-i)).strftime('%Y-%m-%d')
        stats = daily_stats.get(date, {'views': 0, 'visitors': set()})
        daily_stats_list.append({
            'date': date,
            'views': stats['views'],
            'visitors': len(stats['visitors'])
        })
    
    # Top pages
    top_pages = []
    for (path, title), views in page_views.most_common(5):
        top_pages.append({
            'path': path,
            'views': views,
            'title': title or path.split('/')[-1].replace('-', ' ').title()
        })
    
    # Traffic sources
    total_referrers = sum(referrers.values())
    traffic_sources = []
    for source, count in referrers.most_common():
        percentage = (count / total_referrers * 100) if total_referrers > 0 else 0
        traffic_sources.append({
            'source': source,
            'visitors': count,
            'percentage': round(percentage, 1)
        })
    
    # Calculate trends (would need previous period data for real trends)
    # For now, return neutral trends - implement real trend calculation later
    trends = {
        'pageViews': {'value': 0, 'trend': 'neutral'},
        'visitors': {'value': 0, 'trend': 'neutral'},
        'sessionDuration': {'value': 0, 'trend': 'neutral'},
        'bounceRate': {'value': 0, 'trend': 'neutral'}
    }
    
    # Calculate session duration and bounce rate from real data
    # For now, return placeholder values - implement real calculation later
    avg_session_duration = '0m 0s'  # Would need session start/end tracking
    bounce_rate = '0%'  # Would need session tracking to calculate bounces
    
    if total_page_views > 0:
        # Basic placeholder calculation - replace with real session analysis
        avg_session_duration = f"{total_page_views // unique_visitors if unique_visitors > 0 else 0}m 0s"
        bounce_rate = f"{max(0, 100 - (total_page_views * 10 // unique_visitors if unique_visitors > 0 else 0))}%"
    
    return {
        'totalPageViews': total_page_views,
        'uniqueVisitors': unique_visitors,
        'avgSessionDuration': avg_session_duration,
        'bounceRate': bounce_rate,
        'topPages': top_pages,
        'trafficSources': traffic_sources,
        'dailyStats': daily_stats_list,
        'trends': trends
    }

def generate_empty_analytics_data(days: int) -> Dict[str, Any]:
    """
    Generate empty analytics data structure when no real data is available
    """
    
    # Generate empty daily stats for the date range
    daily_stats = []
    end_date = datetime.now(timezone.utc)
    
    for i in range(days):
        date = end_date - timedelta(days=days-1-i)
        daily_stats.append({
            'date': date.strftime('%Y-%m-%d'),
            'views': 0,
            'visitors': 0
        })
    
    return {
        'totalPageViews': 0,
        'uniqueVisitors': 0,
        'avgSessionDuration': '0m 0s',
        'bounceRate': '0%',
        'topPages': [],
        'trafficSources': [],
        'dailyStats': daily_stats,
        'trends': {
            'pageViews': {'value': 0, 'trend': 'neutral'},
            'visitors': {'value': 0, 'trend': 'neutral'},
            'sessionDuration': {'value': 0, 'trend': 'neutral'},
            'bounceRate': {'value': 0, 'trend': 'neutral'}
        }
    }