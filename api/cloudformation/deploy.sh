#!/bin/bash

function parameter_error() {
    echo "Parameter error: ${1}"
}

function validate_parameters() {
    local is_error=false

    if [ -z "$PROJECT_NAME" ]; then
        parameter_error "PROJECT_NAME"
        is_error=true
    fi

    if [ -z "$ENV" ]; then
        parameter_error "ENV"
        is_error=true
    fi

    if [ -z "$REGION" ]; then
        parameter_error "REGION"
        is_error=true
    fi

    if [ -z "$CODE_BUCKET" ]; then
        parameter_error "CODE_BUCKET"
        is_error=true
    fi

    if [ -z "$UI_HOSTNAME" ]; then
        parameter_error "UI_HOSTNAME (needed for Cognito callbacks)"
        is_error=true
    fi

    if $is_error; then
        exit 1
    fi
}

function exist_s3_bucket() {
    local bucket_name=$1
    local region=$2
    local profile=$3
    
    aws s3api head-bucket --bucket "$bucket_name" --region "$region" --profile "$profile" 2>/dev/null
    return $?
}

function create_s3_bucket() {
    local bucket_name=$1
    local region=$2
    local profile=$3
    
    if [ "$region" == "us-east-1" ]; then
        aws s3api create-bucket --bucket "$bucket_name" --region "$region" --profile "$profile"
    else
        aws s3api create-bucket --bucket "$bucket_name" --region "$region" --create-bucket-configuration LocationConstraint="$region" --profile "$profile"
    fi
}

function deploy() {
    echo "=== Environment Variables ==="
    echo "PROJECT_NAME: $PROJECT_NAME"
    echo "ENV: $ENV"
    echo "REGION: $REGION"
    echo "STACK_NAME: $STACK_NAME"
    echo "CODE_BUCKET: $CODE_BUCKET"
    echo "UI_HOSTNAME: $UI_HOSTNAME"
    echo "=========================="
    
    NOW=$(date "+%Y%m%d_%H%M%S")
    CODE_PATH="${ENV}/${NOW}"

    # Package sources and dependencies
    CODE_ZIP="portfolio.zip"
    pushd ../
    rm -rf ./cloudformation/${CODE_ZIP}
    
    pushd ./lambda

    pip3 install -r ./requirements.txt --target ./
    zip -q ../cloudformation/${CODE_ZIP} -r .
    popd

    popd

    # Prepare upload bucket
    exist_s3_bucket ${CODE_BUCKET} ${REGION} ${AWS_PROFILE} || create_s3_bucket ${CODE_BUCKET} ${REGION} ${AWS_PROFILE}

    # Upload to s3 (code)
    aws --region ${REGION} ${AWS_PROFILE_OPTION} s3 cp ../cloudformation/${CODE_ZIP} s3://${CODE_BUCKET}/${CODE_PATH}/${CODE_ZIP}

    # Clean up any obsolete changesets first
    echo "Cleaning up old changesets..."
    OLD_CHANGESETS=$(aws --region ${REGION} cloudformation list-change-sets \
        --stack-name ${STACK_NAME} \
        --query 'Summaries[?ExecutionStatus==`OBSOLETE` || ExecutionStatus==`FAILED`].ChangeSetName' \
        --output text 2>/dev/null || echo "")
    
    if [ -n "$OLD_CHANGESETS" ]; then
        for changeset in $OLD_CHANGESETS; do
            echo "Deleting old changeset: $changeset"
            aws --region ${REGION} cloudformation delete-change-set \
                --stack-name ${STACK_NAME} \
                --change-set-name "$changeset" 2>/dev/null || true
        done
    fi

    # Deploy with retry logic
    echo "Deploying CloudFormation stack..."
    RETRY_COUNT=0
    MAX_RETRIES=3
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if aws --region ${REGION} cloudformation deploy \
            --template-file template.yaml \
            --s3-bucket ${CODE_BUCKET} \
            --s3-prefix ${CODE_PATH} \
            --stack-name ${STACK_NAME} \
            --capabilities CAPABILITY_NAMED_IAM \
            --no-fail-on-empty-changeset \
            --parameter-overrides \
                ProjectName=${PROJECT_NAME} \
                Env=${ENV} \
                CodeBucket=${CODE_BUCKET} \
                CodePath="${CODE_PATH}/${CODE_ZIP}" \
                PythonRuntime=${DEFAULT_PYTHON_RUNTIME} \
                UiHostname=${UI_HOSTNAME} \
                GoogleClientId="" \
                GoogleClientSecret="" \
                LinkedInClientId="" \
                LinkedInClientSecret=""; then
            echo "✅ Deployment successful"
            
            # Get and display API URL
            API_BASE_URL=$(aws --region ${REGION} cloudformation describe-stacks \
                --stack-name ${STACK_NAME} \
                --query "Stacks[0].Outputs[?OutputKey=='ApiBaseUrl'].OutputValue" \
                --output text)
            
            MEDIA_BUCKET=$(aws --region ${REGION} cloudformation describe-stacks \
                --stack-name ${STACK_NAME} \
                --query "Stacks[0].Outputs[?OutputKey=='MediaBucketName'].OutputValue" \
                --output text)
            
            echo "=== Deployment Outputs ==="
            echo "API Base URL: ${API_BASE_URL}"
            echo "Media Bucket: ${MEDIA_BUCKET}"
            echo "=========================="
            break
        else
            RETRY_COUNT=$((RETRY_COUNT + 1))
            echo "⚠️ Deployment failed, retrying ($RETRY_COUNT/$MAX_RETRIES)..."
            
            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                # Clean up any failed changesets and wait before retry
                OLD_CHANGESETS=$(aws --region ${REGION} cloudformation list-change-sets \
                    --stack-name ${STACK_NAME} \
                    --query 'Summaries[?ExecutionStatus==`OBSOLETE` || ExecutionStatus==`FAILED`].ChangeSetName' \
                    --output text 2>/dev/null || echo "")
                
                if [ -n "$OLD_CHANGESETS" ]; then
                    for changeset in $OLD_CHANGESETS; do
                        aws --region ${REGION} cloudformation delete-change-set \
                            --stack-name ${STACK_NAME} \
                            --change-set-name "$changeset" 2>/dev/null || true
                    done
                fi
                
                sleep 10
            else
                echo "❌ Deployment failed after $MAX_RETRIES attempts"
                exit 1
            fi
        fi
    done
}

validate_parameters
echo "ENV: ${ENV} parameters are valid"

echo "Started Deployment"
deploy
echo "Finished Deployment"