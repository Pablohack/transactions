import React from 'react';
import { QueryProvider } from './providers';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/shared/components';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            className: 'bg-surface-elevated border border-surface-border text-text-primary',
          }}
        />
      </QueryProvider>
    </ErrorBoundary>
  );
};
