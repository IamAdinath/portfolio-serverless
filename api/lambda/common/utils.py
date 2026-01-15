
import json
import logging

logger = logging.getLogger(__name__)


def build_response(status_code, headers, body=None):
    if not body:
        data = json.dumps({})
    else:
        data = json.dumps(body)
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": data
    }


def extract_s3_key_from_url(url_or_key):
    """
    Extract S3 key from a full S3 URL or return the key if already a key.
    
    Handles multiple formats:
    - Full S3 URL: https://bucket.s3.amazonaws.com/path/to/file.jpg
    - Regional S3 URL: https://bucket.s3.region.amazonaws.com/path/to/file.jpg
    - Presigned URL: https://bucket.s3.amazonaws.com/path/to/file.jpg?X-Amz-...
    - S3 key: path/to/file.jpg
    - Empty/None: returns None
    
    Args:
        url_or_key (str): Full S3 URL or S3 key
        
    Returns:
        str: S3 key (path/to/file.jpg) or None if invalid
        
    Examples:
        >>> extract_s3_key_from_url("https://my-bucket.s3.amazonaws.com/posts/img.jpg")
        "posts/img.jpg"
        
        >>> extract_s3_key_from_url("posts/img.jpg")
        "posts/img.jpg"
        
        >>> extract_s3_key_from_url("https://my-bucket.s3.us-east-1.amazonaws.com/posts/img.jpg?X-Amz-...")
        "posts/img.jpg"
    """
    if not url_or_key:
        return None
    
    # If it's already a key (no http/https), return as-is
    if not url_or_key.startswith('http://') and not url_or_key.startswith('https://'):
        return url_or_key
    
    # Extract S3 key from full URL
    try:
        # Check if it's an S3 URL
        if '.amazonaws.com/' in url_or_key:
            # Split by .amazonaws.com/ to get the key part
            key_with_params = url_or_key.split('.amazonaws.com/', 1)[1]
            
            # Remove query parameters (presigned URL params)
            s3_key = key_with_params.split('?')[0]
            
            logger.debug(f"Extracted S3 key '{s3_key}' from URL '{url_or_key}'")
            return s3_key
        else:
            # Not an S3 URL, return as-is
            logger.warning(f"URL does not appear to be an S3 URL: {url_or_key}")
            return url_or_key
            
    except Exception as e:
        logger.error(f"Error extracting S3 key from URL '{url_or_key}': {e}")
        # Return original value as fallback
        return url_or_key


def process_image_references(images_list, media_bucket, get_s3_file_url_func):
    """
    Process a list of image references (URLs or keys) and convert them to presigned URLs.
    
    This is a centralized function to handle image processing consistently across all endpoints.
    
    Args:
        images_list (list): List of image URLs or S3 keys
        media_bucket (str): S3 bucket name
        get_s3_file_url_func (callable): Function to generate presigned URLs
        
    Returns:
        list: List of presigned URLs
        
    Examples:
        >>> from common.s3 import get_s3_file_url
        >>> images = ["https://bucket.s3.amazonaws.com/posts/img.jpg", "posts/img2.jpg"]
        >>> process_image_references(images, "my-bucket", get_s3_file_url)
        ["https://bucket.s3.amazonaws.com/posts/img.jpg?X-Amz-...", "https://bucket.s3.amazonaws.com/posts/img2.jpg?X-Amz-..."]
    """
    if not images_list or not isinstance(images_list, list):
        return []
    
    presigned_urls = []
    
    for image_ref in images_list:
        if not image_ref:  # Skip empty strings/None
            continue
        
        # Extract S3 key from URL or use key directly
        s3_key = extract_s3_key_from_url(image_ref)
        
        if not s3_key:
            logger.warning(f"Skipping invalid image reference: {image_ref}")
            continue
        
        # Generate presigned URL
        try:
            presigned_url = get_s3_file_url_func(media_bucket, s3_key)
            if presigned_url:
                presigned_urls.append(presigned_url)
            else:
                logger.warning(f"Failed to generate presigned URL for key: {s3_key}")
        except Exception as e:
            logger.error(f"Error generating presigned URL for key '{s3_key}': {e}")
            continue
    
    return presigned_urls

