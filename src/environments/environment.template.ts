/**
 * Environment configuration template
 * 
 * IMPORTANT: 
 * 1. Copy this file to environment.ts and environment.prod.ts
 * 2. Values will be injected from .env file during build
 * 3. Keep environment.ts, environment.prod.ts, and .env out of version control
 */

declare const process: any; // Needed for environment variables

export const environment = {
  production: false, // Set to true in environment.prod.ts
  
  firebase: {
    // These values are injected from .env during build
    projectId: process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_APP_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL
  },
  auth: {
    authority: process.env.GOOGLE_AUTHORITY,
    clientId: process.env.GOOGLE_CLIENT_ID,
    scope: process.env.GOOGLE_SCOPE,
    redirectUrl: window.location.origin, // This is dynamic
    postLogoutRedirectUri: window.location.origin, // This is dynamic
    responseType: 'id_token token',
    silentRenew: true,
    useRefreshToken: true,
   // logLevel: LogLevel.Debug ,
  }
};
