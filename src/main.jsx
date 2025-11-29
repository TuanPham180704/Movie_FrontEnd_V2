import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./pages/ErrorFallback.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
