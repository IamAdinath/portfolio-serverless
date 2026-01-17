import os
import json
import boto3
from common.utils import build_response
from common.contsants import StatusCodes, Headers
from common.s3 import get_s3_file_url, s3_file_exists, get_s3_file_metadata
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
        
        # Get file type from query parameters
        query_params = event.get('queryStringParameters') or {}
        file_type = query_params.get('type', '').lower() if query_params else ''
        
        if not file_type:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"message": "File type parameter 'type' is required."},
            )
        
        # Map file types to environment variables and default expiration times
        file_configs = {
            'profile': {
                'env_var': 'PROFILE_IMAGE_PATH',
                'default_path': 'public/Adinath_Gore.jpg',
                'expires_in': 3600,  # 1 hour
                'response_key': 'imageUrl',
                'filename_key': None
            },
            'resume': {
                'env_var': 'RESUME_PATH', 
                'default_path': 'public/Adinath_Gore_Resume.pdf',
                'expires_in': 300,   # 5 minutes
                'response_key': 'downloadUrl',
                'filename_key': 'filename'
            }
        }
        
        if file_type not in file_configs:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"message": f"Unsupported file type: {file_type}. Supported types: {', '.join(file_configs.keys())}"},
            )
        
        config = file_configs[file_type]
        
        # Get file path from environment variable or use default
        file_path = os.getenv(config['env_var'], config['default_path'])
        
        logger.info(f"Looking for {file_type} file at: {file_path}")
        
        # Check if file exists
        if not s3_file_exists(MEDIA_BUCKET, file_path):
            logger.error(f"{file_type.capitalize()} file not found: {file_path}")
            return build_response(
                StatusCodes.NOT_FOUND,
                Headers.CORS,
                {"message": f"{file_type.capitalize()} file not found."},
            )
        
        # Generate presigned URL
        presigned_url = get_s3_file_url(MEDIA_BUCKET, file_path, expires_in=config['expires_in'])
        
        if not presigned_url:
            logger.error(f"Failed to generate presigned URL for {file_type}")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": f"Failed to generate {file_type} URL."},
            )
        
        # Get file metadata
        metadata = get_s3_file_metadata(MEDIA_BUCKET, file_path)
        last_modified = metadata.get('LastModified').isoformat() if metadata and metadata.get('LastModified') else None
        
        logger.info(f"Generated presigned URL for {file_type}")
        
        # Build response
        response_data = {
            "message": f"{file_type.capitalize()} URL generated successfully.",
            config['response_key']: presigned_url,
            "expiresIn": config['expires_in'],
            "lastModified": last_modified
        }
        
        # Add filename for downloadable files
        if config['filename_key']:
            filename = os.path.basename(file_path)
            response_data[config['filename_key']] = filename
        
        return build_response(
            StatusCodes.OK,
            Headers.CORS,
            response_data,
        )
        
    except Exception as e:
        logger.error(f"Error getting {file_type if 'file_type' in locals() else 'media'} file: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "Failed to get media file."},
        )