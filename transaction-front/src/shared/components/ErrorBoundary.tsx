import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/shared/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="max-w-2xl w-full">
            <ErrorState
              title="Oops! Algo salió mal"
              message={
                this.state.error?.message || 
                'Ha ocurrido un error inesperado. Por favor, intenta recargar la página.'
              }
              onRetry={this.handleReset}
            />
            
            {import.meta.env.VITE_DEV && this.state.error && (
              <details className="mt-6 p-4 bg-surface-elevated border border-surface-border rounded">
                <summary className="cursor-pointer font-semibold text-text-primary mb-2">
                  Detalles del error (solo en desarrollo)
                </summary>
                <pre className="text-sm text-text-secondary overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
