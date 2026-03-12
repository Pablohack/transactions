import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

describe('EmptyState Component', () => {
  it('should render with title', () => {
    render(<EmptyState title="No hay datos para mostrar" />);
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
  });

  it('should render with custom title and description', () => {
    render(
      <EmptyState 
        title="No hay transacciones" 
        description="Crea tu primera transacción para comenzar"
      />
    );
    expect(screen.getByText('No hay transacciones')).toBeInTheDocument();
    expect(screen.getByText('Crea tu primera transacción para comenzar')).toBeInTheDocument();
  });

  it('should render with action button when provided', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState 
        title="No hay transacciones" 
        action={<Button onClick={handleAction}>Crear nueva</Button>}
      />
    );
    
    expect(screen.getByText('Crear nueva')).toBeInTheDocument();
  });

  it('should call action onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    
    render(
      <EmptyState 
        title="No hay transacciones" 
        action={<Button onClick={handleAction}>Crear nueva</Button>}
      />
    );
    
    const button = screen.getByText('Crear nueva');
    await user.click(button);
    
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('should render icon when title is displayed', () => {
    const { container } = render(<EmptyState title="Sin datos" />);
    
    // Verificar que el ícono SVG esté presente
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should not render action when not provided', () => {
    render(<EmptyState title="No hay datos" />);
    
    // Verificar que no hay botones
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should render custom icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">🎉</span>;
    render(
      <EmptyState 
        title="Custom icon" 
        icon={<CustomIcon />}
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
