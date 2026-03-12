import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionPageHeader } from './TransactionPageHeader';

describe('TransactionPageHeader', () => {
  it('should render title and description', () => {
    render(<TransactionPageHeader onCreateClick={vi.fn()} />);
    
    expect(screen.getByText('Transacciones')).toBeInTheDocument();
    expect(screen.getByText('Gestiona tus transacciones de Tenpo')).toBeInTheDocument();
  });

  it('should render create button', () => {
    render(<TransactionPageHeader onCreateClick={vi.fn()} />);
    
    expect(screen.getByText('+ Nueva Transacción')).toBeInTheDocument();
  });

  it('should call onCreateClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleCreateClick = vi.fn();
    
    render(<TransactionPageHeader onCreateClick={handleCreateClick} />);
    
    const createButton = screen.getByText('+ Nueva Transacción');
    await user.click(createButton);
    
    expect(handleCreateClick).toHaveBeenCalledTimes(1);
  });
});
