import os
import json
import logging
from common.contsants import StatusCodes, Headers
from common.utils import build_response
from common.s3 import put_s3_file, get_s3_file_url, delete_s3_file, get_s3_file_metadata

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    logger.info(f"Received event: {event}")

    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return build_response(StatusCodes.OK, Headers.CORS, {})

    media_bucket = os.getenv("MEDIA_BUCKET")
    resume_path = os.getenv("RESUME_KEY", "public/Adinath_Gore_Resume.pdf")
    
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

        logger.info(f"Uploading resume to: {resume_path}")

        # Delete existing file if it exists
        try:
            delete_s3_file(media_bucket, resume_path)
            logger.info(f"Deleted existing resume at {resume_path}")
        except Exception as e:
            logger.info(f"No existing file to delete or error deleting: {str(e)}")

        # Upload new file with content type
        put_s3_file(media_bucket, resume_path, file_content, content_type='application/pdf')
        
        # Get metadata including last modified date
        metadata = get_s3_file_metadata(media_bucket, resume_path)
        last_modified = metadata.get('LastModified').isoformat() if metadata.get('LastModified') else None
        
        file_url = get_s3_file_url(media_bucket, resume_path, expires_in=3600)
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            {
                "message": "Resume uploaded successfully",
                "downloadUrl": file_url,
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
        logger.error(f"Error uploading resume: {str(e)}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": str(e)},
        )
