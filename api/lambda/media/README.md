# Media API

This unified media API handles all public file requests using environment variables for file paths.

## Environment Variables

- `MEDIA_BUCKET`: S3 bucket name for media files
- `PROFILE_IMAGE_PATH`: S3 path to profile image (default: `public/Adinath_Gore.jpg`)
- `RESUME_PATH`: S3 path to resume file (default: `public/Adinath_Gore_Resume.pdf`)

## Usage

### Get Profile Image
```
GET /get-media?type=profile
```

Response:
```json
{
  "message": "Profile URL generated successfully.",
  "imageUrl": "https://s3-presigned-url...",
  "expiresIn": 3600
}
```

### Get Resume Download
```
GET /get-media?type=resume
```

Response:
```json
{
  "message": "Resume URL generated successfully.",
  "downloadUrl": "https://s3-presigned-url...",
  "filename": "Adinath_Gore_Resume.pdf",
  "expiresIn": 300
}
```

## Adding New File Types

To add new file types, update the `file_configs` dictionary in `get_media.py`:

```python
file_configs = {
    'newtype': {
        'env_var': 'NEW_FILE_PATH',
        'default_path': 'public/default_file.ext',
        'expires_in': 3600,
        'response_key': 'fileUrl',
        'filename_key': 'filename'  # Optional
    }
}
```

Then add the corresponding environment variable to CloudFormation template.