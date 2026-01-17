from common.contsants import StatusCodes, Headers
from common.utils import build_response


def lambda_handler(event, context):
    """Handle OPTIONS requests for CORS preflight"""
    return build_response(
        StatusCodes.OK,
        Headers.CORS,
        {},
    )
