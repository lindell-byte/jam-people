import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "", // Your Azure App Registration Client ID
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || "common"}`, // Your tenant ID or 'common'
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000", // Your redirect URI
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "profile", "openid", "email"],
};

// Organization configuration
export const organizationConfig = {
  // Replace with your organization's tenant ID or domain
  allowedTenant: process.env.NEXT_PUBLIC_AZURE_TENANT_ID || "",
  // Optional: Add specific domain validation
  allowedDomain: process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "", // e.g., "yourcompany.com"
};
