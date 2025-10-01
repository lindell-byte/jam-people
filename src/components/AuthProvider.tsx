"use client";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/msalConfig";
import { useEffect } from "react";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Handle redirect response when returning from Microsoft login
    msalInstance.handleRedirectPromise().catch((error) => {
      console.error("Redirect handling error:", error);
    });
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}
