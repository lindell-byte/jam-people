"use client";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/msalConfig";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}
