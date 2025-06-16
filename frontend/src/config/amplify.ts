// frontend/src/config/amplify.ts
import { Amplify } from 'aws-amplify';

const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
const cognitoUserPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const cognitoAppClientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;
const cognitoRegion = import.meta.env.VITE_COGNITO_REGION;

// Ensure the domain for OAuth does not include 'https://'
const oauthDomain = cognitoDomain.startsWith('https://') 
    ? cognitoDomain.substring(8) 
    : cognitoDomain;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: cognitoUserPoolId,
      userPoolClientId: cognitoAppClientId,
      region: cognitoRegion,
      loginWith: {
        oauth: {
          domain: oauthDomain, // Use the processed domain
          scopes: ['openid', 'email', 'profile'], // 'aws.cognito.signin.user.admin' was removed for troubleshooting
          redirectSignIn: ['http://localhost:3000'],
          redirectSignOut: ['http://localhost:3000'],
          responseType: 'code', // 'code' for Authorization Code Grant
          providers: ['Google']
        },
      },
    },
  },
  // ... other configurations
});

export default Amplify;