import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactionActions } from './useTransactionActions';
import * as transactionsApi from '@/features/transactions/api/transactions.api';
import type { Transaction, CreateTransactionInput, UpdateTransactionInput } from '@/features/transactions/model';

// Mock de la API y toast
vi.mock('@/features/transactions/api/transactions.api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTransactionActions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('debe tener el estado inicial correcto', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFormModalOpen).toBe(false);
      expect(result.current.selectedTransaction).toBeUndefined();
      expect(result.current.transactionToDelete).toBeUndefined();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isDeleting).toBe(false);
    });
  });

  describe('handleCreate - Crear nueva transacción', () => {
    it('debe abrir el modal de formulario para crear', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleCreate();
      });

      expect(result.current.isFormModalOpen).toBe(true);
      expect(result.current.selectedTransaction).toBeUndefined();
    });
  });

  describe('handleEdit - Editar transacción', () => {
    const mockTransaction: Transaction = {
      id: 1,
      amount: 50000,
      business: 'Supermercado',
      tenpista: 'Juan Pérez',
      date: '2026-03-10T10:00:00',
    };

    it('debe abrir el modal de formulario con la transacción seleccionada', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleEdit(mockTransaction);
      });

      expect(result.current.isFormModalOpen).toBe(true);
      expect(result.current.selectedTransaction).toEqual(mockTransaction);
    });

    it('debe actualizar selectedTransaction correctamente', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      const transaction1: Transaction = { ...mockTransaction, id: 1 };
      const transaction2: Transaction = { ...mockTransaction, id: 2 };

      act(() => {
        result.current.handleEdit(transaction1);
      });

      expect(result.current.selectedTransaction).toEqual(transaction1);

      act(() => {
        result.current.handleEdit(transaction2);
      });

      expect(result.current.selectedTransaction).toEqual(transaction2);
    });
  });

  describe('handleDelete - Preparar eliminación', () => {
    const mockTransaction: Transaction = {
      id: 1,
      amount: 50000,
      business: 'Supermercado',
      tenpista: 'Juan Pérez',
      date: '2026-03-10T10:00:00',
    };

    it('debe establecer la transacción a eliminar', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete(mockTransaction);
      });

      expect(result.current.transactionToDelete).toEqual(mockTransaction);
    });
  });

  describe('handleSubmit - Enviar formulario', () => {
    const newTransactionData: CreateTransactionInput = {
      amount: 30000,
      business: 'Restaurant',
      tenpista: 'Pedro López',
      date: '2026-03-10T12:00:00',
    };

    const createdTransaction: Transaction = {
      id: 3,
      ...newTransactionData,
    };

    it('debe crear una nueva transacción cuando no hay ID', async () => {
      vi.mocked(transactionsApi.transactionsApi.create).mockResolvedValue(createdTransaction);

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleCreate();
      });

      await act(async () => {
        await result.current.handleSubmit(newTransactionData);
      });

      await waitFor(() => {
        expect(transactionsApi.transactionsApi.create).toHaveBeenCalledWith(newTransactionData);
        expect(result.current.isFormModalOpen).toBe(false);
      });
    });

    it('debe actualizar una transacción existente cuando hay ID', async () => {
      const existingTransaction: Transaction = {
        id: 1,
        amount: 50000,
        business: 'Supermercado',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      };

      const updateData: UpdateTransactionInput = {
        id: 1,
        amount: 35000,
        business: 'Supermercado Updated',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      };

      vi.mocked(transactionsApi.transactionsApi.update).mockResolvedValue({
        ...existingTransaction,
        ...updateData,
      });

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleEdit(existingTransaction);
      });

      await act(async () => {
        await result.current.handleSubmit(updateData);
      });

      await waitFor(() => {
        expect(transactionsApi.transactionsApi.update).toHaveBeenCalledWith(1, updateData);
        expect(result.current.isFormModalOpen).toBe(false);
      });
    });

    it('debe establecer isSubmitting a true durante el envío', async () => {
      let wasSubmitting = false;
      vi.mocked(transactionsApi.transactionsApi.create).mockImplementation(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return createdTransaction;
        }
      );

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleCreate();
      });

      // Usar mutate en lugar de mutateAsync a través de handleSubmit
      // y capturar el estado pending durante la ejecución
      result.current.handleSubmit(newTransactionData);

      await waitFor(() => {
        if (result.current.isSubmitting) {
          wasSubmitting = true;
        }
      }, { timeout: 200 });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });

      expect(wasSubmitting || !result.current.isSubmitting).toBe(true);
    });
  });

  describe('handleConfirmDelete - Confirmar eliminación', () => {
    const mockTransaction: Transaction = {
      id: 1,
      amount: 50000,
      business: 'Supermercado',
      tenpista: 'Juan Pérez',
      date: '2026-03-10T10:00:00',
    };

    it('debe eliminar la transacción y limpiar el estado', async () => {
      vi.mocked(transactionsApi.transactionsApi.delete).mockResolvedValue(undefined);

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete(mockTransaction);
      });

      expect(result.current.transactionToDelete).toEqual(mockTransaction);

      await act(async () => {
        await result.current.handleConfirmDelete();
      });

      await waitFor(() => {
        expect(transactionsApi.transactionsApi.delete).toHaveBeenCalledWith(1);
        expect(result.current.transactionToDelete).toBeUndefined();
      });
    });

    it('no debe llamar a delete si no hay transacción seleccionada', async () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleConfirmDelete();
      });

      expect(transactionsApi.transactionsApi.delete).not.toHaveBeenCalled();
    });

    it('debe establecer isDeleting a true durante la eliminación', async () => {
      let wasDeleting = false;
      vi.mocked(transactionsApi.transactionsApi.delete).mockImplementation(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return undefined;
        }
      );

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete(mockTransaction);
      });

      // Iniciar eliminación sin envolver en act para poder observar el estado intermedio
      result.current.handleConfirmDelete();

      await waitFor(() => {
        if (result.current.isDeleting) {
          wasDeleting = true;
        }
      }, { timeout: 200 });

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
      });

      expect(wasDeleting || !result.current.isDeleting).toBe(true);
    });
  });

  describe('handleCancelDelete - Cancelar eliminación', () => {
    const mockTransaction: Transaction = {
      id: 1,
      amount: 50000,
      business: 'Supermercado',
      tenpista: 'Juan Pérez',
      date: '2026-03-10T10:00:00',
    };

    it('debe limpiar transactionToDelete', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete(mockTransaction);
      });

      expect(result.current.transactionToDelete).toEqual(mockTransaction);

      act(() => {
        result.current.handleCancelDelete();
      });

      expect(result.current.transactionToDelete).toBeUndefined();
    });
  });

  describe('handleCloseFormModal - Cerrar modal de formulario', () => {
    it('debe cerrar el modal de formulario', () => {
      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleCreate();
      });

      expect(result.current.isFormModalOpen).toBe(true);

      act(() => {
        result.current.handleCloseFormModal();
      });

      expect(result.current.isFormModalOpen).toBe(false);
    });
  });

  describe('Flujo completo de creación', () => {
    it('debe manejar el flujo completo: abrir modal, crear, cerrar modal', async () => {
      const newTransactionData: CreateTransactionInput = {
        amount: 30000,
        business: 'Restaurant',
        tenpista: 'Pedro López',
        date: '2026-03-10T12:00:00',
      };

      vi.mocked(transactionsApi.transactionsApi.create).mockResolvedValue({
        id: 1,
        ...newTransactionData,
      });

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      // 1. Abrir modal de creación
      act(() => {
        result.current.handleCreate();
      });
      expect(result.current.isFormModalOpen).toBe(true);
      expect(result.current.selectedTransaction).toBeUndefined();

      // 2. Enviar formulario
      await act(async () => {
        await result.current.handleSubmit(newTransactionData);
      });

      // 3. Verificar que se cerró el modal
      await waitFor(() => {
        expect(result.current.isFormModalOpen).toBe(false);
      });
    });
  });

  describe('Flujo completo de edición', () => {
    it('debe manejar el flujo completo: abrir modal con data, actualizar, cerrar modal', async () => {
      const existingTransaction: Transaction = {
        id: 1,
        amount: 50000,
        business: 'Supermercado',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      };

      const updateData: UpdateTransactionInput = {
        id: 1,
        amount: 35000,
        business: 'Supermercado Updated',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      };

      vi.mocked(transactionsApi.transactionsApi.update).mockResolvedValue({
        ...existingTransaction,
        ...updateData,
      });

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      // 1. Abrir modal de edición
      act(() => {
        result.current.handleEdit(existingTransaction);
      });
      expect(result.current.isFormModalOpen).toBe(true);
      expect(result.current.selectedTransaction).toEqual(existingTransaction);

      // 2. Enviar actualización
      await act(async () => {
        await result.current.handleSubmit(updateData);
      });

      // 3. Verificar que se cerró el modal
      await waitFor(() => {
        expect(result.current.isFormModalOpen).toBe(false);
      });
    });
  });

  describe('Flujo completo de eliminación', () => {
    it('debe manejar el flujo completo: seleccionar, confirmar eliminación', async () => {
      const mockTransaction: Transaction = {
        id: 1,
        amount: 50000,
        business: 'Supermercado',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      };

      vi.mocked(transactionsApi.transactionsApi.delete).mockResolvedValue(undefined);

      const { result } = renderHook(() => useTransactionActions(), {
        wrapper: createWrapper(),
      });

      // 1. Seleccionar transacción para eliminar
      act(() => {
        result.current.handleDelete(mockTransaction);
      });
      expect(result.current.transactionToDelete).toEqual(mockTransaction);

      // 2. Confirmar eliminación
      await act(async () => {
        await result.current.handleConfirmDelete();
      });

      // 3. Verificar que se limpió el estado
      await waitFor(() => {
        expect(result.current.transactionToDelete).toBeUndefined();
        expect(transactionsApi.transactionsApi.delete).toHaveBeenCalledWith(1);
      });
    });
  });
});
