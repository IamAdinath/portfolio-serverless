# Cognito Custom Domain Setup Guide

## Domain Structure

The auth domain is **automatically constructed** from your API domain:

- **Production**: If `ApiHostname=api.adinathgore.com` → Auth domain: `auth.api.adinathgore.com`
- **Development**: If `ApiHostname=dev.api.adinathgore.com` → Auth domain: `auth-dev.api.adinathgore.com`

## Prerequisites

1. **ACM Certificate in us-east-1**: Cognito custom domains require an ACM certificate in the `us-east-1` region (N. Virginia), regardless of where your User Pool is located.

2. **Use Same Certificate as API**: The template automatically uses the same certificate ARN as your API Gateway custom domain.

3. **Wildcard Certificate Required**: Your certificate must cover both API and auth subdomains. Use `*.api.adinathgore.com` to cover:
   - `api.adinathgore.com`
   - `dev.api.adinathgore.com`
   - `auth.api.adinathgore.com`
   - `auth-dev.api.adinathgore.com`

## Steps

### 1. Create ACM Certificate in us-east-1

```bash
# Request wildcard certificate for all API subdomains
aws acm request-certificate \
  --domain-name "*.api.adinathgore.com" \
  --validation-method DNS \
  --region us-east-1
```

**Important**: Note the certificate ARN - you'll need just the UUID part (after `certificate/`)

### 2. Validate the Certificate

Add the DNS validation records provided by ACM to your DNS provider (Route53, Cloudflare, etc.)

### 3. Deploy the Stack

The auth domain is automatically constructed - no additional parameters needed!

**Production**:
```bash
./deploy.sh \
  --parameter-overrides \
  ApiHostname=api.adinathgore.com \
  ApiCertificateArn=<certificate-uuid> \
  Env=prod
```

**Development**:
```bash
./deploy.sh \
  --parameter-overrides \
  ApiHostname=dev.api.adinathgore.com \
  ApiCertificateArn=<certificate-uuid> \
  Env=dev
```

The template will automatically create:
- Production: `auth.api.adinathgore.com`
- Development: `auth-dev.api.adinathgore.com`

### 4. Configure DNS

After deployment, you'll get a CloudFront distribution domain in the outputs. Create a CNAME record:

**Production**:
- **Type**: CNAME  
- **Name**: auth.api  
- **Value**: `<CloudFrontDistribution>` (from stack outputs)  
- **TTL**: 300

**Development**:
- **Type**: CNAME  
- **Name**: auth-dev.api  
- **Value**: `<CloudFrontDistribution>` (from stack outputs)  
- **TTL**: 300

Example:
```
auth.api.adinathgore.com -> d111111abcdef8.cloudfront.net
auth-dev.api.adinathgore.com -> d222222abcdef8.cloudfront.net
```

### 5. Update Frontend Configuration

Update your frontend `awsConfig.ts` to use the custom domain:

**Production**:
```typescript
oauth: {
  domain: 'auth.api.adinathgore.com',
  scope: ['email', 'openid', 'profile'],
  redirectSignIn: 'https://adinathgore.com/callback',
  redirectSignOut: 'https://adinathgore.com/logout',
  responseType: 'code'
}
```

**Development**:
```typescript
oauth: {
  domain: 'auth-dev.api.adinathgore.com',
  scope: ['email', 'openid', 'profile'],
  redirectSignIn: 'https://dev.adinathgore.com/callback',
  redirectSignOut: 'https://dev.adinathgore.com/logout',
  responseType: 'code'
}
```

## Verification

Test the custom domain:
```bash
# Production
curl https://auth.api.adinathgore.com/.well-known/jwks.json

# Development
curl https://auth-dev.api.adinathgore.com/.well-known/jwks.json
```

You should see the JWKS keys response.

## Troubleshooting

### Certificate Issues
- Ensure certificate is in `us-east-1` region
- Verify certificate status is "Issued"
- Check certificate includes wildcard `*.api.adinathgore.com`

### DNS Issues
- Wait for DNS propagation (can take up to 48 hours)
- Verify CNAME record points to CloudFront distribution
- Use `dig` or `nslookup` to check DNS resolution

### CloudFormation Errors
- If you get "Domain already exists", delete the old domain first
- Check that the certificate ARN is correct (UUID only, not full ARN)

## Benefits

- **Simplified Configuration**: No need to specify auth domain separately
- **Consistent Naming**: Auth domain automatically matches API domain pattern
- **Single Certificate**: Use the same wildcard certificate for API and Auth
- **Environment Aware**: Automatically adds `-dev` suffix for non-production environments

## Notes

- Cognito custom domains use CloudFront, so changes may take 15-20 minutes to propagate
- The certificate MUST be in us-east-1, even if your stack is in another region
- The wildcard certificate `*.api.adinathgore.com` covers all subdomains under `api.adinathgore.com`
