import { RouterProvider } from "react-router-dom";
import { Head } from "./internal-components/Head";
import { OuterErrorBoundary } from "./prod-components/OuterErrorBoundary";
import { router } from "./router";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { DEFAULT_THEME } from "./constants/default-theme";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { stackClientApp } from "app/auth";

export const AppWrapper = () => {
  return (
    <OuterErrorBoundary>
      <StackProvider app={stackClientApp}>
      <StackTheme>
      <ThemeProvider defaultTheme={DEFAULT_THEME}>
        <RouterProvider router={router} />
        <Head />
      </ThemeProvider>
      </StackTheme>
      </StackProvider>
    </OuterErrorBoundary>
  );
};