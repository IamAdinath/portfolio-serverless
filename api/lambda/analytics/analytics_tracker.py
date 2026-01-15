import json
import boto3
import os
from datetime import datetime, timezone
from typing import Dict, Any
import uuid

def lambda_handler(event, context):
    """
    Lambda handler for tracking analytics events
    This endpoint receives page views, user interactions, etc.
    """
    
    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': ''
        }
    
    try:
        # Get DynamoDB table
        dynamodb = boto3.resource('dynamodb')
        analytics_table = dynamodb.Table(os.environ['ANALYTICS_TABLE'])
        
        # Parse the request
        body = json.loads(event.get('body', '{}'))
        
        # Extract analytics data
        event_type = body.get('event_type', 'page_view')
        page_path = body.get('page_path', '/')
        page_title = body.get('page_title', '')
        user_agent = event.get('headers', {}).get('User-Agent', '')
        ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
        referrer = body.get('referrer', '')
        session_id = body.get('session_id', str(uuid.uuid4()))
        user_id = body.get('user_id', None)  # For authenticated users
        
        # Create analytics record
        timestamp = datetime.now(timezone.utc).isoformat()
        analytics_record = {
            'id': str(uuid.uuid4()),
            'timestamp': timestamp,
            'date': datetime.now(timezone.utc).strftime('%Y-%m-%d'),
            'hour': datetime.now(timezone.utc).strftime('%Y-%m-%d-%H'),
            'event_type': event_type,
            'page_path': page_path,
            'page_title': page_title,
            'user_agent': user_agent,
            'ip_address': ip_address,
            'referrer': referrer,
            'session_id': session_id,
            'user_id': user_id,
            'ttl': int((datetime.now(timezone.utc).timestamp() + (365 * 24 * 60 * 60)))  # 1 year TTL
        }
        
        # Store in DynamoDB
        analytics_table.put_item(Item=analytics_record)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({'message': 'Analytics event tracked successfully'})
        }
        
    except Exception as e:
        print(f"Error tracking analytics: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to track analytics event',
                'message': str(e)
            })
        }