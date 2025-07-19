import os
import json
import boto3
from boto3.dynamodb.conditions import Key
from common.contsants import StatusCodes, Headers
from common.utils import build_response
import logging
from common.s3 import get_s3_file_url

dynamodb = boto3.resource("dynamodb")

logger = logging.getLogger(__name__)


def lambda_handler(event, context):
    logger.info(f"Received event: {event}")
    table_name = os.getenv("BLOGS_TABLE")
    media_bucket = os.getenv("MEDIA_BCUKET")
    if not table_name:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "BLOGS_TABLE env variable not set"},
        )

    if not media_bucket:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "MEDIA_BCUKET env variable not set"},
        )

    table = dynamodb.Table(table_name)
    blog_id = event.get("pathParameters", {}).get("id")
    if not blog_id:
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"error": "Blog ID is required"},
        )
    try:
        response = table.get_item(Key={"id": blog_id, "status": "published"})
    except Exception as e:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR, Headers.CORS, {"error": str(e)}
        )
    item = response.get("Item")
    if not item:
        return build_response(
            StatusCodes.NOT_FOUND,
            Headers.CORS,
            {"error": "Blog not found"},
        )
    images_list = item.get("images", [])
    item["reading_time"] = int(item["reading_time"])
    images_singed_urls = []
    for image in images_list:
        images_singed_urls.append(get_s3_file_url(media_bucket, image))
    item["images"] = images_singed_urls

    return build_response(
        StatusCodes.OK,
        Headers.CORS,
        json.dumps(items),
    )
