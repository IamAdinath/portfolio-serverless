import os
import json
import uuid
from datetime import datetime
import boto3
from common.contsants import StatusCodes, Headers
from common.utils import build_response

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    table_name = os.getenv("POSTS_TABLE")
    if not table_name:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "POSTS_TABLE env variable not set"}
        )

    table = dynamodb.Table(table_name)

    try:
        body = json.loads(event.get("body", "{}"))
        title = body["title"]
        content = body["content"]
        author = body["author"]
        tags = body.get("tags", [])
        status = body.get("status", "draft")  # 'published' or 'draft'

        blog_id = str(uuid.uuid4())
        published_at = datetime.utcnow().isoformat()

        item = {
            "id": blog_id,
            "title": title,
            "content": content,
            "author": author,
            "tags": tags,
            "status": status,
            "published_at": published_at
        }

        table.put_item(Item=item)

        return build_response(
            StatusCodes.CREATED,
            Headers.CORS,
            {"message": "Blog created successfully", "id": blog_id}
        )

    except KeyError as e:
        return build_response(
            StatusCodes.BAD_REQUEST,
            Headers.CORS,
            {"error": f"Missing required field: {str(e)}"}
        )

    except Exception as e:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": str(e)}
        )
