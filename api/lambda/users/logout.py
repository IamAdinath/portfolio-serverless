import json
import os
import boto3
from botocore.exceptions import ClientError

cognito_client = boto3.client('cognito-idp')
USER_POOL_ID = os.environ.get('USER_POOL_ID')

def lambda_handler(event, context):
    """
    Handle user logout - invalidate tokens and clear session
    """
    
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    }
    
    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight'})
        }
    
    try:
        # Get access token from Authorization header
        auth_header = event.get('headers', {}).get('Authorization', '')
        
        if not auth_header:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Missing Authorization header'
                })
            }
        
        # Extract token (remove 'Bearer ' prefix if present)
        access_token = auth_header.replace('Bearer ', '').strip()
        
        # Global sign out - invalidates all tokens for the user
        try:
            cognito_client.global_sign_out(
                AccessToken=access_token
            )
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Successfully logged out',
                    'success': True
                })
            }
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            
            if error_code == 'NotAuthorizedException':
                # Token already invalid or expired
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'message': 'Already logged out',
                        'success': True
                    })
                }
            else:
                raise e
    
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Failed to logout',
                'details': str(e)
            })
        }
