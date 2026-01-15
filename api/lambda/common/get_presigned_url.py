import os
import json
import boto3
import logging
from urllib.parse import unquote

from common.contsants import StatusCodes, Headers
from common.utils import build_response

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')


def lambda_handler(event, context):
    logger.info(f"Received event: {event}")

    media_bucket = os.getenv("MEDIA_BUCKET")
    if not media_bucket:
        logger.error("MEDIA_BUCKET env variable is not set")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "MEDIA_BUCKET env variable not set"},
        )

    # Get fileName from query parameters
    query_params = event.get("queryStringParameters") or {}
    file_name = query_params.get("fileName")
    
    if not file_name:
        logger.error("fileName query parameter is required")
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"error": "fileName query parameter is required"},
        )

    # URL decode the filename
    file_name = unquote(file_name)

    # Determine content type based on file extension
    content_type = 'image/jpeg'  # default
    file_lower = file_name.lower()
    if file_lower.endswith('.png'):
        content_type = 'image/png'
    elif file_lower.endswith('.gif'):
        content_type = 'image/gif'
    elif file_lower.endswith('.webp'):
        content_type = 'image/webp'
    elif file_lower.endswith(('.jpg', '.jpeg')):
        content_type = 'image/jpeg'
    elif file_lower.endswith('.svg'):
        content_type = 'image/svg+xml'
    
    logger.info(f"Generating presigned URL for {file_name} with content type {content_type}")

    try:
        # Generate presigned URL for PUT operation (upload)
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': media_bucket,
                'Key': file_name,
                'ContentType': content_type
            },
            ExpiresIn=3600  # URL expires in 1 hour
        )
        
        # Also generate the public URL for accessing the file after upload
        public_url = f"https://{media_bucket}.s3.amazonaws.com/{file_name}"
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {
                "presignedUrl": presigned_url,
                "publicUrl": public_url,
                "fileName": file_name
            },
        )
    except Exception as e:
        logger.error(f"Error generating presigned URL: {str(e)}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": str(e)},
        )