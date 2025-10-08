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
        
        # Resume is stored in public/Adinath_Gore_Resume.pdf
        resume_key = "public/Adinath_Gore_Resume.pdf"
        
        # Check if file exists
        if not s3_file_exists(MEDIA_BUCKET, resume_key):
            logger.error(f"Resume not found: {resume_key}")
            return build_response(
                StatusCodes.NOT_FOUND,
                Headers.CORS,
                {"message": "Resume not found."},
            )
        
        # Generate presigned URL for download (valid for 5 minutes)
        presigned_url = get_s3_file_url(MEDIA_BUCKET, resume_key, expires_in=300)
        
        if not presigned_url:
            logger.error("Failed to generate presigned URL for resume")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Failed to generate download URL."},
            )
        
        logger.info(f"Generated presigned URL for resume download")
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {
                "message": "Resume download URL generated successfully.",
                "downloadUrl": presigned_url,
                "filename": "Adinath_Gore_Resume.pdf",
                "expiresIn": 300
            },
        )
        
    except Exception as e:
        logger.error(f"Error getting resume download URL: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to get resume download URL."},
        )