import os
import json
import uuid
from datetime import datetime
import boto3
from common.utils import build_response
from common.contsants import StatusCodes, Headers
import logging

dynamodb = boto3.resource("dynamodb")


logger = logging.getLogger(__name__)


def lambda_handler(event, context):
    try:
        BLOGS_TABLE = os.getenv("BLOGS_TABLE")
        if not BLOGS_TABLE:
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "BLOGS_TABLE env variable not set."},
            )
        logger.info(f"Received event: {event}")
        user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
        if not user_id:
            return build_response(
                StatusCodes.UNAUTHORIZED,
                Headers.CORS,
                {"message": "User not authenticated."},
            )
        logger.info(f"User ID: {user_id}")
        body = json.loads(event["body"])
        title = body.get("title", "").strip()
        content = body.get("content", "").strip()
        tags = body.get("tags", [])
        reading_time = body.get("reading_time", 1)
        blog_status = body.get("status", "draft")  # Default to draft

        # For drafts, only title is required. For published posts, both title and content are required.
        if not title:
            logger.error(f"Invalid Title: '{title}'")
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"message": "Title is required."},
            )
        
        if blog_status == "published" and not content:
            logger.error(f"Published post requires content. Title: '{title}', Content: '{content}'")
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"message": "Content is required for published posts."},
            )

        blog_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        # For GSI compatibility, always set published_at (use created_at for drafts)
        published_at_value = now if blog_status == "published" else f"draft_{now}"
        
        item = {
            "id": blog_id,
            "author": user_id,
            "title": title,
            "content": content or "<p></p>",  # Default empty content for drafts
            "tags": tags,
            "reading_time": reading_time,
            "images": body.get("images", []),  # expect list of image URLs (S3)
            "created_at": now,
            "updated_at": now,
            "status": blog_status,
            "status_published_at": f"{blog_status}_{now}",
            "author_index": f"{user_id}_{published_at_value}",
            "published_at": published_at_value,
        }

        table = dynamodb.Table(BLOGS_TABLE)
        table.put_item(Item=item)

        return build_response(
            StatusCodes.CREATED,
            Headers.CORS,
            {"message": f"Blog {blog_status} created successfully.", "id": blog_id, "blog_id": blog_id},
        )

    except Exception as e:
        logger.error(f"Error: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to create blog."},
        )
