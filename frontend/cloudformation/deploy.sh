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

    if [ -z "$HOSTNAME" ]; then
        echo HOSTNAME not defined
        is_error=true
    fi

    if [ -z "$UI_BUCKET_NAME" ]; then
        echo UI_BUCKET_NAME not defined
        is_error=true
    fi

    if [ -z "$ACM_CERTIFICATE_ARN" ]; then
        echo ACM_CERTIFICATE_ARN not defined
        is_error=true
    fi

    if "${is_error}"; then
        exit 1
    fi
}

function deploy() {
    export REACT_APP_INSTANCE=$ENV
    # change to ui root directory
    pushd $DIR/..
        npm ci
        npm run build
    popd
    echo "ACM_CERTIFICATE_ARN >>>> " $ACM_CERTIFICATE_ARN
    STACK_NAME=portfolio-${ENV}-UI
    aws --region ${REGION} cloudformation deploy \
    --template-file $DIR/template.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
    Hostname=${HOSTNAME} \
    BucketName=${UI_BUCKET_NAME} \
    SSLCertArn=${ACM_CERTIFICATE_ARN} 

    DISTRIBUTION_ID=$(aws --region ${REGION} cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
    aws --region ${REGION} s3 sync ${DIR}/../build s3://$UI_BUCKET_NAME --acl public-read --delete
    aws --region ${REGION} cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/' '/*'
}


validate_parameters
deploy