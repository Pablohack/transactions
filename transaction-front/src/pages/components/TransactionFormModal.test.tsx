import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionFormModal } from './TransactionFormModal';

// Mock del TransactionForm
vi.mock('@/features/transactions', () => ({
  TransactionForm: ({ onSubmit, onCancel, isSubmitting }: { 
    onSubmit: (data: unknown) => void; 
    onCancel: () => void; 
    isSubmitting: boolean;
  }) => (
    <div>
      <button onClick={() => onSubmit({ amount: 1000 })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
      <span>{isSubmitting ? 'Submitting' : 'Not submitting'}</span>
    </div>
  ),
}));

describe('TransactionFormModal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <TransactionFormModal
        isOpen={false}
        transaction={undefined}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.queryByText('Crear Transacción')).not.toBeInTheDocument();
  });

  it('should render create mode when no transaction is provided', () => {
    render(
      <TransactionFormModal
        isOpen={true}
        transaction={undefined}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('Crear Transacción')).toBeInTheDocument();
  });

  it('should render edit mode when transaction is provided', () => {
    const transaction = {
      id: 1,
      amount: 5000,
      business: 'Test Business',
      tenpista: 'Test Tenpista',
      date: '2024-01-01T10:00:00Z',
    };
    
    render(
      <TransactionFormModal
        isOpen={true}
        transaction={transaction}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('Editar Transacción')).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(
      <TransactionFormModal
        isOpen={true}
        transaction={undefined}
        isSubmitting={false}
        onSubmit={handleSubmit}
        onClose={vi.fn()}
      />
    );
    
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith({ amount: 1000 });
  });

  it('should call onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <TransactionFormModal
        isOpen={true}
        transaction={undefined}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onClose={handleClose}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should pass isSubmitting to form', () => {
    render(
      <TransactionFormModal
        isOpen={true}
        transaction={undefined}
        isSubmitting={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('Submitting')).toBeInTheDocument();
  });

  it('should not allow closing when submitting', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <TransactionFormModal
        isOpen={true}
        transaction={undefined}
        isSubmitting={true}
        onSubmit={vi.fn()}
        onClose={handleClose}
      />
    );
    
    // Intentar cerrar el modal (click en backdrop)
    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    await user.click(closeButton);
    
    // No debería llamar a onClose porque isSubmitting es true
    expect(handleClose).not.toHaveBeenCalled();
  });
});
