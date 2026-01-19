from common import s3
from common import utils
from common.contsants import Headers, StatusCodes
import os
import logging

logger = logging.getLogger(__name__)
logger.setLevel(os.environ.get('LOG_LEVEL', 'INFO').upper())


def lambda_handler(event, context):
    """
        return s3 file signed url
    """
    try:
        bucket = os.environ.get('RESUME_BUCKET') or os.environ.get('MEDIA_BUCKET')
        resume_file = os.environ.get('RESUME_KEY', 'public/Adinath_Gore_Resume.pdf')
        url = s3.get_s3_file_url(bucket, resume_file)
        if not url:
            return utils.build_response(StatusCodes.NOT_FOUND, Headers.CORS)
        return utils.build_response(StatusCodes.OK, Headers.CORS, {"url": url})
    except Exception as e:
        logger.error(f"Error: {e}")
        return utils.build_response(StatusCodes.INTERNAL_SERVER_ERROR, Headers.CORS)
