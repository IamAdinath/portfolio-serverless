#!/bin/bash

if [ -z "$ENV" ]
  then
    echo "Environment name not specified. Please specify a valid Instance from ./instances"
fi
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "DIRECTORY >>> " $DIR

INSTANCE_PATH=$DIR/environment/${ENV}.sh

if [ -f "$INSTANCE_PATH" ]; then
    echo "$INSTANCE_PATH exists."
    . $INSTANCE_PATH
else
    echo "$INSTANCE_PATH does not exist."
    exit 1
fi

function validate_parameters() {
    local is_error=false

    if [ -z "$ENV" ]; then
        echo ENV not defined
        is_error=true
    fi

    if [ -z "$REGION" ]; then
        echo REGION not defined
        is_error=true
    fi

    if [ -z "$UI_BUCKET_NAME" ]; then
        echo UI_BUCKET_NAME not defined
        is_error=true
    fi

    if "${is_error}"; then
        exit 1
    fi
}

function deploy() {
    export REACT_APP_INSTANCE=$ENV
    export REACT_APP_API_BASE_URL="$REACT_APP_API_BASE_URL"
    export REACT_APP_COGNITO_USER_POOL_ID="$REACT_APP_COGNITO_USER_POOL_ID"
    export REACT_APP_COGNITO_CLIENT_ID="$REACT_APP_COGNITO_CLIENT_ID"
    export REACT_APP_COGNITO_REGION="$REACT_APP_COGNITO_REGION"
    export REACT_APP_COGNITO_DOMAIN="$REACT_APP_COGNITO_DOMAIN"
    export REACT_APP_COGNITO_REDIRECT_SIGNIN="$REACT_APP_COGNITO_REDIRECT_SIGNIN"
    export REACT_APP_COGNITO_REDIRECT_SIGNOUT="$REACT_APP_COGNITO_REDIRECT_SIGNOUT"
    export REACT_APP_API_KEY="$REACT_APP_API_KEY"
    
    # change to ui root directory
    pushd $DIR/..
        npm install
        npm run build
    popd
    
    echo "REACT_APP_API_BASE_URL >> $REACT_APP_API_BASE_URL"
    echo "REACT_APP_COGNITO_USER_POOL_ID >> $REACT_APP_COGNITO_USER_POOL_ID"
    echo "REACT_APP_COGNITO_CLIENT_ID >> $REACT_APP_COGNITO_CLIENT_ID"
    echo "REACT_APP_COGNITO_REGION >> $REACT_APP_COGNITO_REGION"
    echo "REACT_APP_COGNITO_DOMAIN >> $REACT_APP_COGNITO_DOMAIN"
    echo "REACT_APP_COGNITO_REDIRECT_SIGNIN >> $REACT_APP_COGNITO_REDIRECT_SIGNIN"
    echo "REACT_APP_COGNITO_REDIRECT_SIGNOUT >> $REACT_APP_COGNITO_REDIRECT_SIGNOUT"
    echo "REACT_APP_API_KEY >> $REACT_APP_API_KEY"
    echo "UI_BUCKET_NAME >> $UI_BUCKET_NAME"
    
    STACK_NAME=portfolio-${ENV}-UI
    aws --region ${REGION} cloudformation deploy \
    --template-file $DIR/template-dev.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
    BucketName=${UI_BUCKET_NAME}

    DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
    CLOUDFRONT_URL=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" --output text)
    
    aws --region ${REGION} s3 sync ${DIR}/../build s3://$UI_BUCKET_NAME --acl public-read --delete
    aws --region ${REGION} cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/' '/*'
    
    echo "Deployment completed!"
    echo "CloudFront URL: $CLOUDFRONT_URL"
}

validate_parameters
deploy