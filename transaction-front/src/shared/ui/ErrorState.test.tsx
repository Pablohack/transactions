import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState';

describe('ErrorState Component', () => {
  it('should render with default title and message', () => {
    render(<ErrorState message="Ocurrió un error al cargar los datos" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Ocurrió un error al cargar los datos')).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    render(
      <ErrorState 
        title="Error de carga" 
        message="Error al cargar transacciones" 
      />
    );
    expect(screen.getByText('Error de carga')).toBeInTheDocument();
    expect(screen.getByText('Error al cargar transacciones')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const handleRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={handleRetry} />);
    
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    
    render(<ErrorState message="Error" onRetry={handleRetry} />);
    
    const retryButton = screen.getByText('Reintentar');
    await user.click(retryButton);
    
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    
    expect(screen.queryByText('Reintentar')).not.toBeInTheDocument();
  });

  it('should render error icon', () => {
    const { container } = render(<ErrorState message="Error" />);
    
    // Verificar que el ícono SVG de error esté presente
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display error icon with correct color', () => {
    const { container } = render(<ErrorState message="Error" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-error');
  });
});
