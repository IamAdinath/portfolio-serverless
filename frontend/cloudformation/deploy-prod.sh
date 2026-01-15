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
    echo "ACM_CERTIFICATE_ARN_PROD: $ACM_CERTIFICATE_ARN_PROD"
    echo "REACT_APP_API_BASE_URL: $REACT_APP_API_BASE_URL"
    echo "REACT_APP_COGNITO_USER_POOL_ID: $REACT_APP_COGNITO_USER_POOL_ID"
    echo "REACT_APP_COGNITO_CLIENT_ID: $REACT_APP_COGNITO_CLIENT_ID"
    echo "REACT_APP_COGNITO_REGION: $REACT_APP_COGNITO_REGION"
    echo "REACT_APP_COGNITO_DOMAIN: $REACT_APP_COGNITO_DOMAIN"
    echo "REACT_APP_COGNITO_REDIRECT_SIGNIN: $REACT_APP_COGNITO_REDIRECT_SIGNIN"
    echo "REACT_APP_COGNITO_REDIRECT_SIGNOUT: $REACT_APP_COGNITO_REDIRECT_SIGNOUT"
    echo "REACT_APP_API_KEY: $REACT_APP_API_KEY"
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
    
    # Sync files and invalidate cache
    aws --region ${REGION} s3 sync ${DIR}/../build s3://$UI_BUCKET_NAME --acl public-read --delete
    aws --region ${REGION} cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/' '/*'
    
    echo "=== Deployment Completed ==="
    echo "Custom Domain URL: $CUSTOM_DOMAIN_URL"
    echo "Distribution ID: $DISTRIBUTION_ID"
}

validate_parameters
deploy