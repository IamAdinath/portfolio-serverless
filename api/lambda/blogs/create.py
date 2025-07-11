import os
import json
import uuid
from datetime import datetime
import boto3
from common.utils import build_response
from common.contsants import StatusCodes, Headers
import logging
dynamodb = boto3.resource('dynamodb')
BLOGS_TABLE = os.environ['BLOGS_TABLE']

logger = logging.getLogger(__name__)
def lambda_handler(event, context):
    try:
        logger.info(f"Received event: {event}")
        user_id = event['requestContext']['authorizer']['claims']['sub']
        if not user_id:
            return build_response(StatusCodes.UNAUTHORIZED, Headers.CORS, {
                "message": "User not authenticated."
            })
        logger.info(f"User ID: {user_id}")
        body = json.loads(event['body'])
        title = body.get('title')
        content = body.get('content')
        tags = body.get('tags', [])
        reading_time = body.get('reading_time', 1)  # default 1 min

        if not title or not content:
            return build_response(StatusCodes.BAD_REQUEST, Headers.CORS, {
                "message": "Title and content are required."
            })

        blog_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        blog_status = 'published'
        item = {
            'id': blog_id,
            'author': user_id,
            'title': title,
            'content': content,
            'tags': tags,
            'reading_time': reading_time,
            'images': body.get('images', []),  # expect list of image URLs (S3)
            'created_at': now,
            'updated_at': now,
            'status': blog_status,
            'status_published_at': f'{blog_status}_{now}',
            'author_index': f'{user_id}_{now}'
        }

        table = dynamodb.Table(BLOGS_TABLE)
        table.put_item(Item=item)

        return build_response(StatusCodes.CREATED, Headers.CORS, {
            "message": "Blog created successfully.",
            "blog_id": blog_id
        })

    except Exception as e:
        print("Error:", e)
        return build_response(StatusCodes.INTERNAL_SERVER_ERROR, Headers.CORS, {
            "message": "Failed to create blog."
        })
