import os
import json
import boto3
from boto3.dynamodb.conditions import Key
from common.contsants import StatusCodes, Headers
from common.utils import build_response, process_image_references
import logging
from common.s3 import get_s3_file_url

dynamodb = boto3.resource("dynamodb")

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(f"Received event: {event}")
    table_name = os.getenv("BLOGS_TABLE")
    media_bucket = os.getenv("MEDIA_BUCKET")
    if not table_name:
        logger.error("BLOGS_TABLE env variable is not set")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "BLOGS_TABLE env variable not set"},
        )

    if not media_bucket:
        logger.error("MEDIA_BUCKET env variable is not set")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "MEDIA_BUCKET env variable not set"},
        )

    blog_id = event.get("queryStringParameters", {}).get("id")
    if not blog_id:
        logger.error("Blog ID is required")
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"error": "Blog ID is required"},
        )
    try:
        table = dynamodb.Table(table_name)
        logger.info(f"Fetching blog with ID: {blog_id}")
        KeyConditionExpression = Key("id").eq(blog_id)
        response = table.query(KeyConditionExpression=KeyConditionExpression)
        item = response.get("Items", [{}])[0]
    except Exception as e:
        logger.error(f"Error fetching blog: {str(e)}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR, Headers.CORS, {"error": str(e)}
        )
    if not item:
        logger.warning(f"Blog with ID {blog_id} not found")
        return build_response(
            StatusCodes.NOT_FOUND,
            Headers.CORS,
            {"error": "Blog not found"},
        )
    # Process images using centralized utility
    images_list = item.get("images", [])
    item["reading_time"] = int(item["reading_time"])
    
    if images_list and isinstance(images_list, list):
        # Use centralized utility function
        item["images"] = process_image_references(images_list, media_bucket, get_s3_file_url)
    else:
        item["images"] = []

    return build_response(
        StatusCodes.OK,
        Headers.CORS,
        json.dumps(item),
    )
