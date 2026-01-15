import os
import json
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Key
from common.utils import build_response
from common.contsants import StatusCodes, Headers
import logging

dynamodb = boto3.resource("dynamodb")
logger = logging.getLogger(__name__)


def lambda_handler(event, context):
    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {}
        )
    
    try:
        BLOGS_TABLE = os.getenv("BLOGS_TABLE")
        if not BLOGS_TABLE:
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "BLOGS_TABLE env variable not set."},
            )
        
        logger.info(f"Received event: {event}")
        
        # Get user ID from Cognito authorizer
        user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
        if not user_id:
            return build_response(
                StatusCodes.UNAUTHORIZED,
                Headers.CORS,
                {"message": "User not authenticated."},
            )
        
        # Get blog ID from query parameters
        blog_id = event.get("queryStringParameters", {}).get("id")
        if not blog_id:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"message": "Blog ID is required."},
            )
        
        # Parse request body
        body = json.loads(event["body"])
        title = body.get("title", "").strip()
        content = body.get("content", "").strip()
        tags = body.get("tags", [])
        reading_time = body.get("reading_time", 1)
        blog_status = body.get("status", "draft")
        images = body.get("images", [])
        
        # Validate required fields
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
        
        table = dynamodb.Table(BLOGS_TABLE)
        
        # Check if blog exists and user owns it
        try:
            response = table.get_item(Key={"id": blog_id})
            if "Item" not in response:
                return build_response(
                    StatusCodes.NOT_FOUND,
                    Headers.CORS,
                    {"message": "Blog not found."},
                )
            
            existing_blog = response["Item"]
            if existing_blog["author"] != user_id:
                return build_response(
                    StatusCodes.FORBIDDEN,
                    Headers.CORS,
                    {"message": "You can only update your own blogs."},
                )
        except Exception as e:
            logger.error(f"Error checking blog ownership: {e}")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Error verifying blog ownership."},
            )
        
        # Update the blog
        now = datetime.utcnow().isoformat()
        
        # Determine published_at value based on status
        if blog_status == "published":
            # If already published, keep existing published_at, otherwise use current time
            if existing_blog.get("status") == "published":
                published_at_value = existing_blog.get("published_at", now)
            else:
                published_at_value = now  # First time publishing
        else:
            # For drafts, use draft prefix to maintain GSI compatibility
            published_at_value = f"draft_{now}"
        
        # Prepare update expression
        update_expression = "SET title = :title, content = :content, tags = :tags, reading_time = :reading_time, images = :images, updated_at = :updated_at, #status = :status, status_published_at = :status_published_at, published_at = :published_at, author_index = :author_index"
        expression_attribute_values = {
            ":title": title,
            ":content": content or "<p></p>",
            ":tags": tags,
            ":reading_time": reading_time,
            ":images": images,
            ":updated_at": now,
            ":status": blog_status,
            ":status_published_at": f"{blog_status}_{now}",
            ":published_at": published_at_value,
            ":author_index": f"{user_id}_{published_at_value}",
        }
        expression_attribute_names = {
            "#status": "status"  # status is a reserved word in DynamoDB
        }
        
        # Perform the update
        table.update_item(
            Key={"id": blog_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names,
        )
        
        logger.info(f"Blog {blog_id} updated successfully by user {user_id}")
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {"message": f"Blog {blog_status} updated successfully.", "id": blog_id},
        )
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"message": "Invalid JSON in request body."},
        )
    except Exception as e:
        logger.error(f"Error updating blog: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to update blog."},
        )