
import json
from common.contsants import Headers

def build_response(status_code, headers, body=None):
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body or {})
    }
