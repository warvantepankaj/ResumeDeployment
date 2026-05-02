import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import { router } from "./App.jsx";
import { ThemeProvider } from "./builder/components/theme-provider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
);
