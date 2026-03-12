import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionsPage } from './TransactionsPage';

// Mock de los hooks personalizados
vi.mock('./hooks', () => ({
  useTransactionActions: vi.fn(() => ({
    isFormModalOpen: false,
    selectedTransaction: undefined,
    transactionToDelete: undefined,
    isSubmitting: false,
    isDeleting: false,
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleDelete: vi.fn(),
    handleSubmit: vi.fn(),
    handleConfirmDelete: vi.fn(),
    handleCancelDelete: vi.fn(),
    handleCloseFormModal: vi.fn(),
  })),
}));

vi.mock('@/features/transactions', () => ({
  useTransactions: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
  TransactionsTable: ({ onEdit, onDelete }: { onEdit: (t: unknown) => void; onDelete: (t: unknown) => void }) => (
    <div>
      <button onClick={() => onEdit({ id: 1 })}>Edit</button>
      <button onClick={() => onDelete({ id: 1 })}>Delete</button>
    </div>
  ),
}));

vi.mock('./components', () => ({
  TransactionPageHeader: ({ onCreateClick }: { onCreateClick: () => void }) => (
    <button onClick={onCreateClick}>Nueva Transacción</button>
  ),
  DeleteTransactionModal: () => <div>Delete Modal</div>,
  TransactionFormModal: () => <div>Form Modal</div>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('TransactionsPage', () => {
  it('should render page header', () => {
    render(<TransactionsPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Nueva Transacción')).toBeInTheDocument();
  });

  it('should render transactions table', () => {
    render(<TransactionsPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render modals', () => {
    render(<TransactionsPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Delete Modal')).toBeInTheDocument();
    expect(screen.getByText('Form Modal')).toBeInTheDocument();
  });

  it('should call handleCreate when create button is clicked', async () => {
    const { useTransactionActions } = await import('./hooks');
    const mockHandleCreate = vi.fn();
    
    vi.mocked(useTransactionActions).mockReturnValue({
      isFormModalOpen: false,
      selectedTransaction: undefined,
      transactionToDelete: undefined,
      isSubmitting: false,
      isDeleting: false,
      handleCreate: mockHandleCreate,
      handleEdit: vi.fn(),
      handleDelete: vi.fn(),
      handleSubmit: vi.fn(),
      handleConfirmDelete: vi.fn(),
      handleCancelDelete: vi.fn(),
      handleCloseFormModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<TransactionsPage />, { wrapper: createWrapper() });
    
    const createButton = screen.getByText('Nueva Transacción');
    await user.click(createButton);
    
    expect(mockHandleCreate).toHaveBeenCalledTimes(1);
  });
});
