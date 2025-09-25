# Azure App Registration Setup Guide

This guide will help you set up Microsoft Azure AD authentication for your JAM PEOPLE form.

## Prerequisites
- Access to Azure Portal (admin privileges in your organization)
- SharePoint/Microsoft 365 organization

## Step 1: Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Fill in the details:
   - **Name**: `JAM PEOPLE Form`
   - **Supported account types**: Select "Accounts in this organizational directory only"
   - **Redirect URI**: 
     - Platform: Single-page application (SPA)
     - URI: `http://localhost:3000` (for development)
     - For production: `https://yourdomain.com`

## Step 2: Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Single-page application**, make sure your redirect URI is added
3. Under **Advanced settings**:
   - Check "Allow public client flows": **No**
   - Check "Enable the following mobile and desktop flows": **No**

## Step 3: Configure API Permissions

1. Go to **API permissions**
2. Click **"Add a permission"**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `User.Read` (should be there by default)
   - `profile`
   - `openid`
   - `email`
6. Click **"Grant admin consent"** (requires admin privileges)

## Step 4: Get Configuration Values

1. Go to **Overview** in your app registration
2. Copy these values:
   - **Application (client) ID** → This is your `NEXT_PUBLIC_AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → This is your `NEXT_PUBLIC_AZURE_TENANT_ID`

## Step 5: Configure Environment Variables

1. Copy `env.example` to `.env.local` in your project root
2. Fill in the values:
   ```
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-from-step-4
   NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id-from-step-4
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
   NEXT_PUBLIC_ALLOWED_DOMAIN=yourcompany.com
   ```

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You should see a sign-in screen
4. Click "Sign in with Microsoft"
5. Sign in with your SharePoint/Microsoft 365 account
6. If successful, you'll see the form with your user info at the top

## Security Features

✅ **Organization-only access**: Only users from your specific Azure tenant can access the form
✅ **Domain validation**: Optional additional restriction to specific email domains
✅ **Session management**: Users stay signed in during their session
✅ **Secure token handling**: Uses Microsoft's secure token handling
✅ **User info display**: Shows who is currently signed in

## Production Deployment

When deploying to production:

1. Update your Azure App Registration:
   - Add your production URL to redirect URIs
   - Update any CORS settings if needed

2. Update environment variables:
   - Set `NEXT_PUBLIC_REDIRECT_URI` to your production URL
   - Ensure all other variables are correctly set

3. Test thoroughly in production environment

## Troubleshooting

**"AADSTS50011: The reply URL specified in the request does not match"**
- Make sure your redirect URI in Azure matches exactly what's in your environment variables

**"You are not authorized to access this form"**
- Check that `NEXT_PUBLIC_AZURE_TENANT_ID` matches your organization's tenant ID
- Verify `NEXT_PUBLIC_ALLOWED_DOMAIN` is correct (or remove it for testing)

**Login popup blocked**
- Make sure popup blockers are disabled for your domain
- Try using redirect flow instead of popup (modify the auth code)

## Support

If you need help with Azure configuration, contact your IT administrator or Microsoft support.
