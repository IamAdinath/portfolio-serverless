// src/config/awsConfig.ts  <-- MAKE SURE THIS LINE ISN'T CAUSING THE ESLINT/TS ERROR if it's actually in your file as plain text

// Helper to remove http(s):// for the domain if your env var includes it
const getCognitoDomain = (domainUrl?: string): string => {
  if (!domainUrl) {
    // throw new Error("Cognito domain URL is undefined. Check REACT_APP_COGNITO_DOMAIN.");
    console.error("Cognito domain URL is undefined. Check REACT_APP_COGNITO_DOMAIN environment variable.");
    return ''; // Return an empty string or handle as an error
  }
  return domainUrl.replace(/^https?:\/\//, '');
};

const cognitoDomain = getCognitoDomain(process.env.REACT_APP_COGNITO_DOMAIN);
const redirectSignIn = process.env.REACT_APP_COGNITO_REDIRECT_SIGNIN;
const redirectSignOut = process.env.REACT_APP_COGNITO_REDIRECT_SIGNOUT;

// Ensure required OAuth variables are present
if (!cognitoDomain) {
  throw new Error("Cognito domain is missing. Check REACT_APP_COGNITO_DOMAIN.");
}
if (!redirectSignIn) {
  throw new Error("Cognito redirectSignIn URL is missing. Check REACT_APP_COGNITO_REDIRECT_SIGNIN.");
}
if (!redirectSignOut) {
  throw new Error("Cognito redirectSignOut URL is missing. Check REACT_APP_COGNITO_REDIRECT_SIGNOUT.");
}


export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: cognitoDomain, // Use the processed variable
          scopes: [
            'openid',
            'email',
            'profile',
            // 'aws.cognito.signin.user.admin' // If needed
          ],
          redirectSignIn: [redirectSignIn], // Use the processed variable
          redirectSignOut: [redirectSignOut], // Use the processed variable
          responseType: 'code' as 'code' | 'token', // <--- THE KEY FIX: Type assertion
        },
      },
    },
  },
  // API: { // Example if you add API configuration
  //   REST: {
  //     'MyAPIName': {
  //       endpoint: process.env.REACT_APP_API_BASE_URL!,
  //       region: process.env.REACT_APP_COGNITO_REGION!
  //     }
  //   }
  // }
};