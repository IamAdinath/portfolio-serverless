#!/bin/bash
set -euo pipefail

function validate_parameters() {
  local is_error=false

  for v in PROJECT_NAME ENV REGION UI_BUCKET_NAME UI_HOSTNAME_PROD ACM_CERTIFICATE_ARN_PROD; do
    if [ -z "${!v:-}" ]; then
      echo "$v not defined"
      is_error=true
    fi
  done

  if [ "$is_error" = true ]; then
    exit 1
  fi
}

function deploy() {
  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  echo "DIRECTORY >>> $DIR"

  echo "=== Environment Variables ==="
  echo "PROJECT_NAME: $PROJECT_NAME"
  echo "ENV: $ENV"
  echo "REGION: $REGION"
  echo "UI_BUCKET_NAME: $UI_BUCKET_NAME"
  echo "UI_HOSTNAME_PROD: $UI_HOSTNAME_PROD"
  echo "============================="

  # Build React app
  pushd "$DIR/.." >/dev/null
    npm ci
    npm run build
  popd >/dev/null

  # Deploy CloudFormation stack
  STACK_NAME="${PROJECT_NAME}-${ENV}-UI"
  aws --region "$REGION" cloudformation deploy \
    --template-file "$DIR/template.yaml" \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
      ProjectName="$PROJECT_NAME" \
      BucketName="$UI_BUCKET_NAME" \
      HostnameProd="$UI_HOSTNAME_PROD" \
      SSLCertArnProd="$ACM_CERTIFICATE_ARN_PROD"

  DISTRIBUTION_ID=$(aws --region "$REGION" cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" \
    --output text)

  CLOUDFRONT_URL=$(aws --region "$REGION" cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
    --output text)

  CUSTOM_DOMAIN_URL=$(aws --region "$REGION" cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CustomDomainURL'].OutputValue" \
    --output text)

  echo "=== Uploading React build to S3 ==="

  # 1) Upload everything with long cache
  aws --region "$REGION" s3 sync "$DIR/../build" "s3://$UI_BUCKET_NAME" \
    --delete \
    --cache-control "public,max-age=31536000,immutable"

  # 2) Override index.html with no-cache
  aws --region "$REGION" s3 cp "$DIR/../build/index.html" "s3://$UI_BUCKET_NAME/index.html" \
    --cache-control "no-cache,no-store,must-revalidate" \
    --content-type "text/html"

  echo "=== Invalidating CloudFront (index.html only) ==="
  INVALIDATION_ID=$(aws --region "$REGION" cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/index.html" \
    --query 'Invalidation.Id' \
    --output text)

  echo "Invalidation started: $INVALIDATION_ID"

  echo "=== Deployment Outputs ==="
  echo "CloudFront URL: $CLOUDFRONT_URL"
  echo "Custom Domain URL: $CUSTOM_DOMAIN_URL"
  echo "Distribution ID: $DISTRIBUTION_ID"
  echo "Bucket: $UI_BUCKET_NAME"
}

validate_parameters
deploy
