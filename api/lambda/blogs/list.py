import json
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
from common.utils import build_response
from common.contsants import StatusCodes, Headers
import logging

logger = logging.getLogger(__name__)

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {}
        )
    
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
        page_size = int(query_params.get('pageSize', '10'))
        last_key = query_params.get('lastKey')
        status_filter = query_params.get('status', 'all')
        
        # Limit page size to prevent abuse
        page_size = min(max(page_size, 1), 50)
        
        logger.info(f"Fetching blogs list - pageSize: {page_size}, status: {status_filter}")

        # Build scan parameters for lightweight query
        scan_params = {
            'ProjectionExpression': 'id, title, #status, created_at, published_at, author',
            'ExpressionAttributeNames': {
                '#status': 'status'
            },
            'Limit': page_size
        }
        
        # Add status filter if specified
        if status_filter != 'all':
            scan_params['FilterExpression'] = Attr('status').eq(status_filter)
        
        # Add pagination token if provided
        if last_key:
            try:
                # Decode the last key (in real app, you'd want to encrypt/sign this)
                import base64
                decoded_key = json.loads(base64.b64decode(last_key).decode('utf-8'))
                scan_params['ExclusiveStartKey'] = decoded_key
            except Exception as e:
                logger.warning(f"Invalid lastKey provided: {e}")
        
        # Execute scan
        response = table.scan(**scan_params)
        items = response.get('Items', [])
        
        # Sort by created_at descending (newest first)
        items.sort(key=lambda x: x.get('published_at', x.get('created_at', '')), reverse=True)
        
        # Prepare response
        result = {
            "blogs": items,
            "count": len(items),
            "hasMore": 'LastEvaluatedKey' in response
        }
        
        # Add next page token if there are more items
        if 'LastEvaluatedKey' in response:
            # Encode the last key (in real app, you'd want to encrypt/sign this)
            import base64
            next_key = base64.b64encode(json.dumps(response['LastEvaluatedKey']).encode('utf-8')).decode('utf-8')
            result['nextPageToken'] = next_key
        
        logger.info(f"Successfully fetched {len(items)} blogs")
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            result
        )

    except Exception as e:
        logger.error(f"Error fetching blogs list: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to fetch blogs list"}
        )