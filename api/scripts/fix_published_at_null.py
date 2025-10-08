#!/usr/bin/env python3
"""
Script to fix existing blog entries that have NULL published_at values.
This is needed for GSI compatibility after the schema change.
"""

import boto3
import os
from datetime import datetime

def fix_published_at_null_values():
    """
    Fix existing blog entries that have NULL published_at values.
    """
    # Initialize DynamoDB
    dynamodb = boto3.resource('dynamodb')
    
    # Get table name from environment or use default
    table_name = os.getenv('BLOGS_TABLE', 'portfolio-Blogs-dev')
    table = dynamodb.Table(table_name)
    
    print(f"Scanning table: {table_name}")
    
    # Scan the table to find items with NULL published_at
    response = table.scan()
    items_to_fix = []
    
    for item in response['Items']:
        # Check if published_at is missing or None
        if 'published_at' not in item or item['published_at'] is None:
            items_to_fix.append(item)
    
    print(f"Found {len(items_to_fix)} items to fix")
    
    # Fix each item
    for item in items_to_fix:
        blog_id = item['id']
        status = item.get('status', 'draft')
        created_at = item.get('created_at', datetime.utcnow().isoformat())
        author = item.get('author', 'unknown')
        
        # Determine the published_at value
        if status == 'published':
            # Use created_at for published posts
            published_at_value = created_at
        else:
            # Use draft prefix for drafts
            published_at_value = f"draft_{created_at}"
        
        # Update the item
        try:
            table.update_item(
                Key={'id': blog_id},
                UpdateExpression='SET published_at = :published_at, author_index = :author_index',
                ExpressionAttributeValues={
                    ':published_at': published_at_value,
                    ':author_index': f"{author}_{published_at_value}"
                }
            )
            print(f"Fixed blog {blog_id}: published_at = {published_at_value}")
        except Exception as e:
            print(f"Error fixing blog {blog_id}: {e}")
    
    print("Migration complete!")

if __name__ == '__main__':
    fix_published_at_null_values()