import json
import boto3
import os
from datetime import datetime

s3 = boto3.client('s3')

def lambda_handler(event, context):
    """
    Lambda function to list photos from S3 bucket with pre-signed URLs
    Returns photos in the format expected by Family Photo Gallery frontend
    
    Environment Variables:
    - BUCKET_NAME: family-bucket-22 (configured in Lambda)
    - AWS_REGION: us-east-2 (default)
    """
    # Get configuration from environment variables
    bucket = os.environ.get('BUCKET_NAME', 'family-bucket-22')
    region = os.environ.get('AWS_REGION', 'us-east-2')
    
    # Pre-signed URL expiration time (in seconds) - 1 hour
    url_expiration = 3600
    
    try:
        # List all objects in the uploads folder
        response = s3.list_objects_v2(Bucket=bucket, Prefix='uploads/')
        
        photos = []
        
        # Process each object in the bucket
        if 'Contents' in response:
            for obj in response['Contents']:
                key = obj['Key']
                
                # Only include image files (jpg, jpeg, png, gif, webp)
                if key.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    # Generate pre-signed URL for the image (valid for 1 hour)
                    try:
                        url = s3.generate_presigned_url(
                            'get_object',
                            Params={
                                'Bucket': bucket,
                                'Key': key
                            },
                            ExpiresIn=url_expiration
                        )
                    except Exception as e:
                        print(f"Error generating pre-signed URL for {key}: {str(e)}")
                        # Fallback to direct URL if pre-signed URL generation fails
                        url = f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
                    
                    # Extract filename for title
                    filename = key.split('/')[-1]
                    title = filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
                    
                    # Create photo object in expected format
                    photo = {
                        'url': url,
                        'key': key,
                        'lastModified': obj['LastModified'].isoformat(),
                        'size': obj['Size'],
                        'metadata': {
                            'title': title,
                            'description': f'Family photo: {title}',
                            'tags': ['family', 'photos']
                        }
                    }
                    
                    photos.append(photo)
        
        # Sort photos by last modified date (newest first)
        photos.sort(key=lambda x: x['lastModified'], reverse=True)
        
        # Return successful response with CORS headers in expected format
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            'body': json.dumps({
                'photos': photos
            })
        }
        
    except Exception as e:
        # Log error to CloudWatch
        print(f"Error listing photos from S3: {str(e)}")
        
        # Return error response with CORS headers
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            'body': json.dumps({
                'error': 'Failed to retrieve photos',
                'message': str(e)
            })
        }
