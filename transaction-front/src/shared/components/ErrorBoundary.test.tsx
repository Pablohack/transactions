import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';

// Componente que lanza un error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suprimir console.error en tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>App content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('App content')).toBeInTheDocument();
  });

  it('should render error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Algo salió mal')).toBeInTheDocument();
  });

  it('should display error message when available', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // El mensaje de error "Test error" debería estar visible
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const CustomFallback = <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('should display retry button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });

  it('should render retry button that is clickable', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Reintentar');
    expect(retryButton).toBeInTheDocument();
    
    // Verificar que el botón es clickeable
    await user.click(retryButton);
    // El comportamiento real (recargar página) se testearía en tests E2E
  });

  it('should log error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // console.error debería haber sido llamado
    expect(console.error).toHaveBeenCalled();
  });
});
