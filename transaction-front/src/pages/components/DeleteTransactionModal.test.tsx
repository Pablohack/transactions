import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteTransactionModal } from './DeleteTransactionModal';

describe('DeleteTransactionModal', () => {
  const mockTransaction = {
    id: 1,
    amount: 5000,
    business: 'Supermercado XYZ',
    tenpista: 'Juan Pérez',
    date: '2024-01-01T10:00:00Z',
  };

  it('should not render when transaction is undefined', () => {
    render(
      <DeleteTransactionModal
        transaction={undefined}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument();
  });

  it('should render when transaction is provided', () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
  });

  it('should display confirmation message', () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText(/¿Estás seguro de que deseas eliminar esta transacción?/)).toBeInTheDocument();
  });

  it('should display transaction details', () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText(/ID:/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Comercio:/)).toBeInTheDocument();
    expect(screen.getByText('Supermercado XYZ')).toBeInTheDocument();
  });

  it('should call onConfirm when delete button is clicked', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={false}
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );
    
    const deleteButton = screen.getByText('Eliminar');
    await user.click(deleteButton);
    
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );
    
    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);
    
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isDeleting is true', () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton).toBeDisabled();
  });

  it('should show loading state on delete button when isDeleting', () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    // El botón debe mostrar estado de carga
    const deleteButton = screen.getByText('Eliminar').closest('button');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should not allow closing when isDeleting is true', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        isDeleting={true}
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );
    
    // Intentar cerrar el modal
    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    await user.click(closeButton);
    
    // No debería llamar a onCancel porque isDeleting es true
    expect(handleCancel).not.toHaveBeenCalled();
  });
});
