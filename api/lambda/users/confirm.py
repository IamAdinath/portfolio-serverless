
import boto3
import logging
import os
from common.utils import build_response
from common.contsants import Headers, StatusCodes

logger = logging.getLogger(__name__)

def handler(event, context):
    """
    Confirm unconfirmed Cognito User
    """
    try:
        if not os.environ.get('USER_POOL_ID'):
            logger.error('USER_POOL_ID not set')
            return build_response(StatusCodes.INTERNAL_SERVER_ERROR, Headers, {'message': 'USER_POOL_ID not set'})
        payload = event.get('body')
        if not payload.get('username'):
            logger.error('username not set')
            return build_response(StatusCodes.BAD_REQUEST, Headers, {'message': 'username not set'})
        client = boto3.client('cognito')
        client.admin_confirm_sign_up(
            UserPoolId=os.environ['userPoolId'],
            username=payload['username']
        )
        return build_response(StatusCodes.OK, Headers.JSON, {'message': 'User confirmed'})
    except Exception as e:
        logger.error(e)
        return build_response(StatusCodes.INTERNAL_SERVER_ERROR, Headers, {'message': str(e)})