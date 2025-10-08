import json
import os
import boto3
from common.utils import build_response
from common.contsants import StatusCodes, Headers
import logging

logger = logging.getLogger(__name__)

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    try:
        # Get table name from environment variable
        table_name = os.getenv('BLOGS_TABLE')
        if not table_name:
            logger.error("BLOGS_TABLE environment variable not set")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Server configuration error"}
            )

        table = dynamodb.Table(table_name)
        
        # Get blog ID from query parameters
        query_params = event.get('queryStringParameters') or {}
        blog_id = query_params.get('id')
        
        if not blog_id:
            return build_response(
                StatusCodes.BAD_REQUEST,
                Headers.CORS,
                {"message": "Blog ID is required"}
            )

        logger.info(f"Attempting to delete blog with ID: {blog_id}")

        # Check if blog exists before deleting
        try:
            response = table.get_item(Key={'id': blog_id})
            if 'Item' not in response:
                return build_response(
                    StatusCodes.NOT_FOUND,
                    Headers.CORS,
                    {"message": "Blog post not found"}
                )
            
            blog_item = response['Item']
            logger.info(f"Found blog to delete: {blog_item.get('title', 'Unknown')}")
            
        except Exception as e:
            logger.error(f"Error checking blog existence: {e}")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Error checking blog existence"}
            )

        # Delete the blog post
        try:
            table.delete_item(Key={'id': blog_id})
            logger.info(f"Successfully deleted blog with ID: {blog_id}")
            
            return build_response(
                StatusCodes.OK,
                Headers.CORS,
                {
                    "message": "Blog post deleted successfully",
                    "deletedId": blog_id
                }
            )
            
        except Exception as e:
            logger.error(f"Error deleting blog: {e}")
            return build_response(
                StatusCodes.INTERNAL_SERVER_ERROR,
                Headers.CORS,
                {"message": "Failed to delete blog post"}
            )

    except Exception as e:
        logger.error(f"Unexpected error in delete blog handler: {e}")
        return build_response(
            StatusCodes.INTERNAL_SERVER_ERROR,
            Headers.CORS,
            {"message": "An unexpected error occurred"}
        )