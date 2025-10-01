"use client";
import { useIsAuthenticated, useMsal, useAccount } from "@azure/msal-react";
import { loginRequest, organizationConfig } from "@/lib/msalConfig";
import { useState, useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated && account) {
      // Check if user is from the allowed organization
      const isFromAllowedTenant = organizationConfig.allowedTenant 
        ? account.tenantId === organizationConfig.allowedTenant 
        : true;
      
      const isFromAllowedDomain = organizationConfig.allowedDomain
        ? account.username?.endsWith(`@${organizationConfig.allowedDomain}`)
        : true;

      if (isFromAllowedTenant && isFromAllowedDomain) {
        setIsAuthorized(true);
        setAuthError("");
      } else {
        setIsAuthorized(false);
        setAuthError("You are not authorized to access this form. Please contact your administrator.");
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, account]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setAuthError("");
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    instance.logoutRedirect();
    setIsAuthorized(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">JAM PEOPLE</h1>
              <p className="text-gray-600">Secure Access Required</p>
            </div>
            
            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{authError}</p>
              </div>
            )}
            
            {!isAuthenticated && (
              <>
                <p className="text-gray-700 mb-6">
                  Please sign in with your SharePoint account to access this form.
                </p>
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.64 12.204c0-.815-.073-1.6-.21-2.352H12.18v4.448h6.458c-.278 1.493-1.125 2.76-2.398 3.61v2.99h3.878c2.268-2.088 3.578-5.162 3.578-8.696z"/>
                        <path d="M12.18 24c3.24 0 5.956-1.075 7.942-2.91l-3.878-2.99c-1.075.72-2.45 1.145-4.064 1.145-3.125 0-5.772-2.11-6.718-4.943H1.505v3.085C3.48 21.295 7.615 24 12.18 24z"/>
                        <path d="M5.462 14.302c-.24-.72-.375-1.488-.375-2.302s.135-1.582.375-2.302V6.613H1.505C.547 8.528 0 10.714 0 13.02s.547 4.492 1.505 6.407l3.957-3.085z"/>
                        <path d="M12.18 4.758c1.762 0 3.344.605 4.588 1.792l3.44-3.44C18.125 1.142 15.41 0 12.18 0 7.615 0 3.48 2.705 1.505 6.613l3.957 3.085c.946-2.833 3.593-4.94 6.718-4.94z"/>
                      </svg>
                      Sign in with Microsoft
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized - show the form with user info
  return (
    <div>
      {/* User info bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{account?.name}</p>
              <p className="text-xs text-gray-500">{account?.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
      
      {/* Main form content */}
      {children}
    </div>
  );
}
