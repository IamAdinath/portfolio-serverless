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

    # Check if this is a production deployment (requires hostname and SSL)
    if [ "$ENV" = "prod" ] || [ "$ENV" = "production" ]; then
        if [ -z "$HOSTNAME" ]; then
            echo "HOSTNAME not defined (required for production)"
            is_error=true
        fi

        if [ -z "$ACM_CERTIFICATE_ARN" ]; then
            echo "ACM_CERTIFICATE_ARN not defined (required for production)"
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
<<<<<<< HEAD
    echo "PROJECT_NAME: $PROJECT_NAME"
=======
>>>>>>> master
    echo "ENV: $ENV"
    echo "REGION: $REGION"
    echo "UI_BUCKET_NAME: $UI_BUCKET_NAME"
    if [ -n "$HOSTNAME" ]; then
        echo "HOSTNAME: $HOSTNAME"
    fi
    if [ -n "$ACM_CERTIFICATE_ARN" ]; then
        echo "ACM_CERTIFICATE_ARN: $ACM_CERTIFICATE_ARN"
    fi
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
    
    # Choose template based on environment
    TEMPLATE_FILE="template.yaml"
<<<<<<< HEAD
    STACK_NAME=${PROJECT_NAME}-${ENV}-UI
=======
    STACK_NAME=portfolio-${ENV}-UI
>>>>>>> master
    
    if [ "$ENV" = "dev" ] || [ "$ENV" = "development" ]; then
        TEMPLATE_FILE="template-dev.yaml"
        echo "Using development template (no custom domain)"
        
        aws --region ${REGION} cloudformation deploy \
        --template-file $DIR/${TEMPLATE_FILE} \
        --stack-name ${STACK_NAME} \
        --capabilities CAPABILITY_NAMED_IAM \
        --no-fail-on-empty-changeset \
        --parameter-overrides \
<<<<<<< HEAD
        ProjectName=${PROJECT_NAME} \
=======
>>>>>>> master
        BucketName=${UI_BUCKET_NAME}
        
        # Get CloudFront URL for dev
        CLOUDFRONT_URL=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" --output text)
        echo "CloudFront URL: $CLOUDFRONT_URL"
    else
        echo "Using production template (with custom domain)"
        
        aws --region ${REGION} cloudformation deploy \
        --template-file $DIR/${TEMPLATE_FILE} \
        --stack-name ${STACK_NAME} \
        --capabilities CAPABILITY_NAMED_IAM \
        --no-fail-on-empty-changeset \
        --parameter-overrides \
<<<<<<< HEAD
        ProjectName=${PROJECT_NAME} \
=======
>>>>>>> master
        Hostname=${HOSTNAME} \
        BucketName=${UI_BUCKET_NAME} \
        SSLCertArn=${ACM_CERTIFICATE_ARN}
        
        echo "Custom Domain URL: https://$HOSTNAME"
    fi

    # Get distribution ID and sync files
    DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
    
    aws --region ${REGION} s3 sync ${DIR}/../build s3://$UI_BUCKET_NAME --acl public-read --delete
    aws --region ${REGION} cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/' '/*'
    
    echo "=== Deployment Completed ==="
    echo "Distribution ID: $DISTRIBUTION_ID"
}

validate_parameters
deploy