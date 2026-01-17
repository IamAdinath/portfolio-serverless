import os
import json
import base64
import logging
from common.contsants import StatusCodes, Headers
from common.utils import build_response
from common.s3 import put_s3_file, get_s3_file_url

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    logger.info(f"Received event: {event}")

    media_bucket = os.getenv("MEDIA_BUCKET")
    profile_image_path = os.getenv("PROFILE_IMAGE_PATH", "public/Adinath_Gore.jpg")
    
    if not media_bucket:
        logger.error("MEDIA_BUCKET env variable is not set")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "MEDIA_BUCKET env variable not set"},
        )

    payload = event.get("body")
    if not payload:
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"error": "Request body is required"},
        )

    try:
        data = json.loads(payload)
        file_content = data.get("file_content") or data.get("fileContent")
        
        if not file_content:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"error": "File content is required"},
            )

        # Upload to the profile image path
        put_s3_file(media_bucket, profile_image_path, file_content)
        file_url = get_s3_file_url(media_bucket, profile_image_path, expires_in=3600)
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {"message": "Profile image uploaded successfully", "imageUrl": file_url},
        )
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON payload")
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"error": "Invalid JSON payload"},
        )
    except Exception as e:
        logger.error(f"Error uploading profile image: {str(e)}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": str(e)},
        )
