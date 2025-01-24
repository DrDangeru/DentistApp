# Environment Setup Guide

## Firebase Configuration Setup

This project uses Firebase and environment variables for configuration. Follow these steps to set up your development environment:

1. Create your environment file:

   ```bash
   # Copy the template file
   cp src/environments/env.template src/environments/.env
   ```

2. Get your Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click on the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Scroll down to "Your apps" section
   - Find your web app or create a new one
   - Copy the configuration values

3. Update your `.env` file:
   - Open `src/environments/.env`
   - Replace the placeholder values with your actual Firebase configuration
   - Keep this file secure and never commit it to version control

4. Environment Files:
   - `src/environments/environment.template.ts` - Template showing the structure (committed to git)
   - `src/environments/environment.ts` - Development environment (not committed)
   - `src/environments/environment.prod.ts` - Production environment (not committed)
   - `src/environments/.env` - Environment variables (not committed)
   - `src/environments/env.template` - Environment variables template (committed)

## Production Deployment

For production deployment:

1. Set up environment variables in your hosting platform (Firebase Hosting, Vercel, etc.)
2. Make sure your CI/CD pipeline:
   - Creates the necessary environment files
   - Injects the correct environment variables during build
   - Uses `environment.prod.ts` for production builds

## Security Notes

- Never commit `.env` files or actual environment files to version control
- Keep your Firebase keys and other secrets secure
- Use different Firebase projects/configurations for development and production
- Regularly rotate your API keys and update them in your deployment platforms
