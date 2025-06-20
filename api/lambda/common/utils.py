
import json
from common.contsants import Headers

def build_response(status_code, headers, body=None):
    return {
        "statusCode": status_code,
        "headers": headers,
        "data": json.dumps(body or {})
    }
