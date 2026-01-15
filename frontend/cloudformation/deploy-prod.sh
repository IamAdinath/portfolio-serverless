#!/bin/bash

function validate_parameters() {
    local is_error=false

    if [ -z "$PROJECT_NAME" ]; then
        echo "PROJECT_NAME not defined"
        is_error=true
    fi

    if [ -z "$ENV" ]; then
        echo "ENV not defined"
        is_error=true
    fi

    if [ -z "$REGION" ]; then
        echo "REGION not defined"
        is_error=true
    fi

    if [ -z "$UI_HOSTNAME_PROD" ]; then
        echo "UI_HOSTNAME_PROD not defined"
        is_error=true
    fi

    if [ -z "$UI_BUCKET_NAME" ]; then
        echo "UI_BUCKET_NAME not defined"
        is_error=true
    fi

    if [ -z "$ACM_CERTIFICATE_ARN_PROD" ]; then
        echo "ACM_CERTIFICATE_ARN_PROD not defined"
        is_error=true
    fi

    if [ "$is_error" = true ]; then
        exit 1
    fi
}

function deploy() {
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
    echo "DIRECTORY >>> " $DIR
    
    echo "=== Environment Variables ==="
    echo "PROJECT_NAME: $PROJECT_NAME"
    echo "ENV: $ENV"
    echo "REGION: $REGION"
    echo "UI_HOSTNAME_PROD: $UI_HOSTNAME_PROD"
    echo "UI_BUCKET_NAME: $UI_BUCKET_NAME"
    echo "=========================="
    
    # Build React app
    pushd $DIR/..
        npm install
        npm run build
    popd
    
    # Deploy CloudFormation stack
    STACK_NAME=${PROJECT_NAME}-${ENV}-UI
    aws --region ${REGION} cloudformation deploy \
    --template-file $DIR/template.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
    ProjectName=${PROJECT_NAME} \
    HostnameProd=${UI_HOSTNAME_PROD} \
    BucketName=${UI_BUCKET_NAME} \
    SSLCertArnProd=${ACM_CERTIFICATE_ARN_PROD}

    # Get outputs
    DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
    CUSTOM_DOMAIN_URL=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CustomDomainURL'].OutputValue" --output text)
    
    echo "=== Starting Zero-Downtime Deployment ==="
    
    # Phase 1: Upload new/changed files (no delete)
    echo "📤 Uploading new files to S3..."
    aws --region ${REGION} s3 sync ${DIR}/../build s3://$UI_BUCKET_NAME --acl public-read
    
    # Phase 2: Invalidate CloudFront cache
    echo "🔄 Invalidating CloudFront cache..."
    INVALIDATION_ID=$(aws --region ${REGION} cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths '/*' \
        --query 'Invalidation.Id' \
        --output text)
    
    echo "⏳ Waiting for invalidation to complete (ID: $INVALIDATION_ID)..."
    aws --region ${REGION} cloudfront wait invalidation-completed \
        --distribution-id $DISTRIBUTION_ID \
        --id $INVALIDATION_ID
    
    # Phase 3: Clean up old files
    echo "🧹 Cleaning up old files..."
    aws --region ${REGION} s3 sync ${DIR}/../build s3://$UI_BUCKET_NAME --acl public-read --delete
    
    echo "=== Deployment Outputs ==="
    echo "Custom Domain URL: $CUSTOM_DOMAIN_URL"
    echo "Distribution ID: $DISTRIBUTION_ID"
    echo "Files synced to S3 bucket: $UI_BUCKET_NAME"
    echo "CloudFront cache invalidated"
    echo "=========================="
}
}

validate_parameters
deploy