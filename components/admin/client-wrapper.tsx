"use client";

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ClientWrapperProps {
  children: ReactNode;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
      <h2 className="text-red-600 font-semibold">Something went wrong:</h2>
      <p className="text-sm text-red-500">{error.message}</p>
    </div>
  );
}

export default function ClientComponentWrapper({ children }: ClientWrapperProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
