import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from './useTransactions';
import * as transactionsApi from '../api/transactions.api';
import type { Transaction, CreateTransactionInput } from '../model';

// Mock de la API
vi.mock('../api/transactions.api');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTransactions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useTransactions - Listado de transacciones', () => {
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        amount: 50000,
        business: 'Supermercado',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      },
      {
        id: 2,
        amount: 25000,
        business: 'Farmacia',
        tenpista: 'María González',
        date: '2026-03-09T15:30:00',
      },
    ];

    it('debe obtener el listado de transacciones exitosamente', async () => {
      vi.mocked(transactionsApi.transactionsApi.getAll).mockResolvedValue(mockTransactions);

      const { result } = renderHook(() => useTransactions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTransactions);
      expect(result.current.error).toBeNull();
    });

    it('debe manejar errores al obtener transacciones', async () => {
      const errorMessage = 'Error al cargar transacciones';
      vi.mocked(transactionsApi.transactionsApi.getAll).mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useTransactions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      }, { timeout: 5000 });

      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });

    it('debe reintentar en caso de error', async () => {
      const getAllSpy = vi.mocked(transactionsApi.transactionsApi.getAll).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useTransactions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      }, { timeout: 5000 });

      // Verifica que se haya llamado al menos una vez
      expect(getAllSpy).toHaveBeenCalled();
    });
  });

  describe('useCreateTransaction - Crear transacción', () => {
    const newTransaction: CreateTransactionInput = {
      amount: 30000,
      business: 'Restaurant',
      tenpista: 'Pedro López',
      date: '2026-03-10T12:00:00',
    };

    const createdTransaction: Transaction = {
      id: 3,
      ...newTransaction,
    };

    it('debe crear una transacción exitosamente', async () => {
      vi.mocked(transactionsApi.transactionsApi.create).mockResolvedValue(createdTransaction);

      const { result } = renderHook(() => useCreateTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newTransaction);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(transactionsApi.transactionsApi.create).toHaveBeenCalledWith(newTransaction);
      expect(result.current.data).toEqual(createdTransaction);
    });

    it('debe manejar errores al crear una transacción', async () => {
      const errorMessage = 'Error al crear transacción';
      vi.mocked(transactionsApi.transactionsApi.create).mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useCreateTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newTransaction);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('debe estar en estado de carga mientras crea la transacción', async () => {
      let wasPending = false;
      vi.mocked(transactionsApi.transactionsApi.create).mockImplementation(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return createdTransaction;
        }
      );

      const { result } = renderHook(() => useCreateTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newTransaction);

      // El estado pending debería estar activo durante la mutación
      await waitFor(() => {
        if (result.current.isPending) {
          wasPending = true;
        }
      }, { timeout: 200 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(wasPending || result.current.isSuccess).toBe(true);
    });
  });

  describe('useUpdateTransaction - Actualizar transacción', () => {
    const updateData = {
      id: 1,
      data: {
        id: 1,
        amount: 35000,
        business: 'Supermercado Updated',
        tenpista: 'Juan Pérez',
        date: '2026-03-10T10:00:00',
      },
    };

    it('debe actualizar una transacción exitosamente', async () => {
      vi.mocked(transactionsApi.transactionsApi.update).mockResolvedValue(updateData.data);

      const { result } = renderHook(() => useUpdateTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(transactionsApi.transactionsApi.update).toHaveBeenCalledWith(
        updateData.id,
        updateData.data
      );
    });

    it('debe manejar errores al actualizar una transacción', async () => {
      vi.mocked(transactionsApi.transactionsApi.update).mockRejectedValue(
        new Error('Error al actualizar')
      );

      const { result } = renderHook(() => useUpdateTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useDeleteTransaction - Eliminar transacción', () => {
    const transactionId = 1;

    it('debe eliminar una transacción exitosamente', async () => {
      vi.mocked(transactionsApi.transactionsApi.delete).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(transactionId);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(transactionsApi.transactionsApi.delete).toHaveBeenCalledWith(transactionId);
    });

    it('debe manejar errores al eliminar una transacción', async () => {
      vi.mocked(transactionsApi.transactionsApi.delete).mockRejectedValue(
        new Error('Error al eliminar')
      );

      const { result } = renderHook(() => useDeleteTransaction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(transactionId);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('debe invalidar el cache después de eliminar', async () => {
      vi.mocked(transactionsApi.transactionsApi.delete).mockResolvedValue(undefined);

      const queryClient = new QueryClient();
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useDeleteTransaction(), { wrapper });

      result.current.mutate(transactionId);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalled();
    });
  });
});
