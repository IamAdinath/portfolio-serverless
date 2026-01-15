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

    if [ -z "$UI_BUCKET_NAME" ]; then
        echo "UI_BUCKET_NAME not defined"
        is_error=true
    fi

    # Check environment-specific requirements
    if [ "$ENV" = "dev" ] || [ "$ENV" = "development" ]; then
        if [ -z "$UI_HOSTNAME_DEV" ]; then
            echo "UI_HOSTNAME_DEV not defined (required for development)"
            is_error=true
        fi

        if [ -z "$ACM_CERTIFICATE_ARN_DEV" ]; then
            echo "ACM_CERTIFICATE_ARN_DEV not defined (required for development)"
            is_error=true
        fi
    elif [ "$ENV" = "prod" ] || [ "$ENV" = "production" ]; then
        if [ -z "$UI_HOSTNAME_PROD" ]; then
            echo "UI_HOSTNAME_PROD not defined (required for production)"
            is_error=true
        fi

        if [ -z "$ACM_CERTIFICATE_ARN_PROD" ]; then
            echo "ACM_CERTIFICATE_ARN_PROD not defined (required for production)"
            is_error=true
        fi
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
    echo "UI_BUCKET_NAME: $UI_BUCKET_NAME"
    if [ -n "$UI_HOSTNAME_DEV" ]; then
        echo "UI_HOSTNAME_DEV: $UI_HOSTNAME_DEV"
    fi
    if [ -n "$UI_HOSTNAME_PROD" ]; then
        echo "UI_HOSTNAME_PROD: $UI_HOSTNAME_PROD"
    fi
    echo "=========================="
    
    # Build React app
    pushd $DIR/..
        npm install
        npm run build
    popd
    
    # Choose template based on environment
    TEMPLATE_FILE="template.yaml"
    STACK_NAME=${PROJECT_NAME}-${ENV}-UI
    
    if [ "$ENV" = "dev" ] || [ "$ENV" = "development" ]; then
        TEMPLATE_FILE="template-dev.yaml"
        echo "Using development template (with custom domain)"
        
        aws --region ${REGION} cloudformation deploy \
        --template-file $DIR/${TEMPLATE_FILE} \
        --stack-name ${STACK_NAME} \
        --capabilities CAPABILITY_NAMED_IAM \
        --no-fail-on-empty-changeset \
        --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        BucketName=${UI_BUCKET_NAME} \
        HostnameDev=${UI_HOSTNAME_DEV} \
        SSLCertArnDev=${ACM_CERTIFICATE_ARN_DEV}
        
        # Get CloudFront URL and custom domain for dev
        CLOUDFRONT_URL=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" --output text)
        CUSTOM_DOMAIN_URL=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CustomDomainURL'].OutputValue" --output text)
        DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
        
        echo "=== Deployment Outputs ==="
        echo "CloudFront URL: $CLOUDFRONT_URL"
        echo "Custom Domain URL: $CUSTOM_DOMAIN_URL"
        echo "Distribution ID: $DISTRIBUTION_ID"
        echo "=========================="
    else
        echo "Using production template (with custom domain)"
        
        aws --region ${REGION} cloudformation deploy \
        --template-file $DIR/${TEMPLATE_FILE} \
        --stack-name ${STACK_NAME} \
        --capabilities CAPABILITY_NAMED_IAM \
        --no-fail-on-empty-changeset \
        --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        HostnameProd=${UI_HOSTNAME_PROD} \
        BucketName=${UI_BUCKET_NAME} \
        SSLCertArnProd=${ACM_CERTIFICATE_ARN_PROD}
        
        CUSTOM_DOMAIN_URL=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CustomDomainURL'].OutputValue" --output text)
        DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
        
        echo "=== Deployment Outputs ==="
        echo "Custom Domain URL: $CUSTOM_DOMAIN_URL"
        echo "Distribution ID: $DISTRIBUTION_ID"
        echo "=========================="
    fi

    # Get distribution ID and sync files
    DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
    
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
    
    echo "=== Deployment Completed ==="
    echo "Distribution ID: $DISTRIBUTION_ID"
    echo "Files synced to S3 bucket: $UI_BUCKET_NAME"
    echo "CloudFront cache invalidated"
    echo "=========================="
}

validate_parameters
deploy