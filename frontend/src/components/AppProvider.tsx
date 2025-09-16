

import type { ReactNode } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app.
 *
 * You can add multiple providers here by nesting them,
 * and they will all be applied to the app.
 *
 * Note: ThemeProvider is already included in AppWrapper.tsx and does not need to be added here.
 */
export const AppProvider = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show the quick Home button on the Account Settings page
  const isAccountSettings = location.pathname.startsWith("/auth/account-settings");
  const showHomeShortcut = isAccountSettings;

  return (
    <>
      {showHomeShortcut && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            className="border-cyan-400 text-cyan-300 hover:bg-cyan-500/10"
            onClick={() => navigate("/")}
            aria-label="Back to Home"
          >
            ← Home
          </Button>
        </div>
      )}
      {children}
    </>
  );
};
