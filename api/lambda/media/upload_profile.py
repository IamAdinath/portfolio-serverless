import os
import json
import logging
from datetime import datetime
from common.contsants import StatusCodes, Headers
from common.utils import build_response
from common.s3 import put_s3_file, get_s3_file_url, delete_s3_file, get_s3_file_metadata

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
        file_type = data.get("file_type") or data.get("fileType") or data.get("content_type") or data.get("contentType")
        
        if not file_content:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"error": "File content is required"},
            )

        # Determine file extension from content type
        extension_map = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp'
        }
        
        # Ensure we always use public/ folder
        base_name = os.path.basename(profile_image_path).rsplit('.', 1)[0] if '.' in profile_image_path else os.path.basename(profile_image_path)
        
        # Determine extension
        if file_type and file_type in extension_map:
            extension = extension_map[file_type]
        else:
            # Default to .jpg if no valid type provided
            extension = '.jpg'
            logger.warning(f"No valid file type provided, defaulting to .jpg")
        
        # Construct final path ensuring it's in public/ folder
        final_path = f"public/{base_name}{extension}"
        
        logger.info(f"Base name: {base_name}, Extension: {extension}, Final path: {final_path}")

        # Delete existing file if it exists
        try:
            delete_s3_file(media_bucket, final_path)
            logger.info(f"Deleted existing profile image at {final_path}")
        except Exception as e:
            logger.info(f"No existing file to delete or error deleting: {str(e)}")

        # Upload new file with content type
        put_s3_file(media_bucket, final_path, file_content, content_type=file_type)
        
        # Get metadata including last modified date
        metadata = get_s3_file_metadata(media_bucket, final_path)
        last_modified = metadata.get('LastModified').isoformat() if metadata.get('LastModified') else None
        
        file_url = get_s3_file_url(media_bucket, final_path, expires_in=3600)
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {
                "message": "Profile image uploaded successfully",
                "imageUrl": file_url,
                "lastModified": last_modified
            },
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
