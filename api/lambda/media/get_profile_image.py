import os
import json
import boto3
from common.utils import build_response
from common.contsants import StatusCodes, Headers
from common.s3 import get_s3_file_url, s3_file_exists
import logging

logger = logging.getLogger(__name__)


def lambda_handler(event, context):
    try:
        MEDIA_BUCKET = os.getenv("MEDIA_BUCKET")
        if not MEDIA_BUCKET:
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "MEDIA_BUCKET env variable not set."},
            )
        
        logger.info(f"Received event: {event}")
        
        # Profile image is stored in public/Adinath_Gore.jpg
        profile_image_key = "public/Adinath_Gore.jpg"
        
        # Check if file exists
        if not s3_file_exists(MEDIA_BUCKET, profile_image_key):
            logger.error(f"Profile image not found: {profile_image_key}")
            return build_response(
                StatusCodes.NOT_FOUND,
                Headers.CORS,
                {"message": "Profile image not found."},
            )
        
        # Generate presigned URL (valid for 1 hour)
        presigned_url = get_s3_file_url(MEDIA_BUCKET, profile_image_key, expires_in=3600)
        
        if not presigned_url:
            logger.error("Failed to generate presigned URL for profile image")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Failed to generate image URL."},
            )
        
        logger.info(f"Generated presigned URL for profile image")
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {
                "message": "Profile image URL generated successfully.",
                "imageUrl": presigned_url,
                "expiresIn": 3600
            },
        )
        
    except Exception as e:
        logger.error(f"Error getting profile image: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to get profile image."},
        )