import json
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
from common.utils import build_response
from common.contsants import StatusCodes, Headers
import logging
from datetime import datetime, timedelta
from collections import defaultdict

logger = logging.getLogger(__name__)

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    try:
        # Get table name from environment variable
        table_name = os.getenv('BLOGS_TABLE')
        if not table_name:
            logger.error("BLOGS_TABLE environment variable not set")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Server configuration error"}
            )

        table = dynamodb.Table(table_name)
        
        # Get query parameters
        query_params = event.get('queryStringParameters') or {}
        blog_id = query_params.get('id')
        
        if blog_id:
            # Get stats for specific blog
            return get_blog_stats(table, blog_id)
        else:
            # Get overall dashboard stats
            return get_dashboard_stats(table)

    except Exception as e:
        logger.error(f"Error fetching blog stats: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to fetch blog stats"}
        )


def get_blog_stats(table, blog_id):
    """Get detailed stats for a specific blog"""
    try:
        # Get blog details
        response = table.get_item(Key={'id': blog_id})
        if 'Item' not in response:
            return build_response(
                StatusCodes.NOT_FOUND,
                Headers.CORS,
                {"message": "Blog not found"}
            )
        
        blog = response['Item']
        
        # Calculate basic stats (in a real app, you'd track these metrics)
        # For now, we'll simulate some stats based on blog data
        created_date = datetime.fromisoformat(blog.get('created_at', '').replace('Z', '+00:00'))
        published_date = None
        if blog.get('published_at'):
            published_date = datetime.fromisoformat(blog.get('published_at', '').replace('Z', '+00:00'))
        
        # Simulate engagement metrics (replace with real analytics)
        days_since_published = 0
        if published_date:
            days_since_published = (datetime.now() - published_date.replace(tzinfo=None)).days
        
        # Simulate realistic metrics based on content length and age
        content_length = len(blog.get('content', ''))
        base_views = min(content_length // 100, 50) + (days_since_published * 2)
        
        stats = {
            "blogId": blog_id,
            "title": blog.get('title', ''),
            "status": blog.get('status', ''),
            "createdAt": blog.get('created_at', ''),
            "publishedAt": blog.get('published_at'),
            "metrics": {
                "totalViews": max(base_views, 0),
                "uniqueVisitors": max(int(base_views * 0.7), 0),
                "avgReadTime": f"{min(content_length // 200, 10):.1f} min",
                "bounceRate": f"{max(30, 100 - (content_length // 50))}%",
                "socialShares": max(int(base_views * 0.1), 0),
                "comments": max(int(base_views * 0.05), 0)
            },
            "performance": {
                "viewsThisWeek": max(int(base_views * 0.3), 0),
                "viewsThisMonth": max(int(base_views * 0.8), 0),
                "topReferrers": [
                    {"source": "Direct", "visits": int(base_views * 0.4)},
                    {"source": "Google", "visits": int(base_views * 0.3)},
                    {"source": "Social Media", "visits": int(base_views * 0.2)},
                    {"source": "Other", "visits": int(base_views * 0.1)}
                ]
            }
        }
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            stats
        )
        
    except Exception as e:
        logger.error(f"Error getting blog stats: {e}")
        raise


def get_dashboard_stats(table):
    """Get overall dashboard statistics"""
    try:
        # Scan all blogs for dashboard stats
        response = table.scan(
            ProjectionExpression='id, #status, created_at, published_at',
            ExpressionAttributeNames={'#status': 'status'}
        )
        
        blogs = response.get('Items', [])
        
        # Calculate stats
        total_blogs = len(blogs)
        published_blogs = len([b for b in blogs if b.get('status') == 'published'])
        draft_blogs = len([b for b in blogs if b.get('status') == 'draft'])
        
        # Calculate publishing trends (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_blogs = []
        
        for blog in blogs:
            if blog.get('published_at'):
                try:
                    pub_date = datetime.fromisoformat(blog.get('published_at', '').replace('Z', '+00:00'))
                    if pub_date.replace(tzinfo=None) >= thirty_days_ago:
                        recent_blogs.append(blog)
                except:
                    continue
        
        # Simulate total reach metrics
        total_estimated_views = sum([
            max(len(blog.get('content', '')) // 100, 10) for blog in blogs
        ])
        
        stats = {
            "overview": {
                "totalBlogs": total_blogs,
                "publishedBlogs": published_blogs,
                "draftBlogs": draft_blogs,
                "totalViews": total_estimated_views,
                "avgViewsPerBlog": int(total_estimated_views / max(published_blogs, 1))
            },
            "trends": {
                "blogsThisMonth": len(recent_blogs),
                "publishingRate": f"{len(recent_blogs) / 4:.1f} per week",
                "growthRate": f"+{min(len(recent_blogs) * 5, 50)}%" if recent_blogs else "0%"
            },
            "topPerformers": [
                {
                    "id": blog['id'],
                    "title": blog.get('title', 'Untitled'),
                    "views": max(len(blog.get('content', '')) // 50, 20),
                    "status": blog.get('status', 'draft')
                }
                for blog in sorted(blogs, key=lambda x: len(x.get('content', '')), reverse=True)[:5]
            ]
        }
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            stats
        )
        
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise