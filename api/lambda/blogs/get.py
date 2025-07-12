import os
import json
import boto3
from boto3.dynamodb.conditions import Key
from common.contsants import StatusCodes, Headers
from common.utils import build_response
import logging

dynamodb = boto3.resource("dynamodb")
logger = logging.getLogger(__name__)


def lambda_handler(event, context):
    logger.info(f"Received event: {event}")
    table_name = os.getenv("BLOGS_TABLE")
    if not table_name:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"error": "BLOGS_TABLE env variable not set"},
        )

    table = dynamodb.Table(table_name)

    params = event.get("queryStringParameters") or {}
    limit = int(params.get("limit", "10"))
    last_key = params.get("lastKey")

    query_kwargs = {
        "IndexName": "status_published_at",
        "KeyConditionExpression": Key("status").eq("published"),
        "ScanIndexForward": False,
        "Limit": limit,
    }

    if last_key:
        try:
            query_kwargs["ExclusiveStartKey"] = json.loads(last_key)
        except json.JSONDecodeError:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"error": "Invalid lastKey parameter"},
            )

    try:
        response = table.query(**query_kwargs)
    except Exception as e:
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR, Headers.CORS, {"error": str(e)}
        )

    items = response.get("Items")
    for item in items:
        item["reading_time"] = int(item["reading_time"])
    last_evaluated_key = response.get("LastEvaluatedKey")
    item = json.dumps(items)
    return build_response(
        StatusCodes.OK,
        Headers.CORS,
        {
            "blogs": items,
            "lastKey": json.dumps(last_evaluated_key) if last_evaluated_key else None,
        },
    )
