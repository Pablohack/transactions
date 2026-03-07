import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionsApi } from '../api';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionListParams,
} from '../model';
import { TRANSACTION_QUERY_KEYS } from '../model';

/**
 * Hook para obtener el listado de transacciones
 */
export const useTransactions = (params?: TransactionListParams) => {
  return useQuery({
    queryKey: TRANSACTION_QUERY_KEYS.list(params || {}),
    queryFn: () => transactionsApi.getAll(params),
    staleTime: 30000, // 30 segundos
    retry: 2,
  });
};

/**
 * Hook para obtener una transacción por ID
 */
export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: TRANSACTION_QUERY_KEYS.detail(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 2,
  });
};

/**
 * Hook para crear una transacción
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionInput) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.lists() });
      toast.success('Transacción creada exitosamente');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error al crear la transacción';
      toast.error(message);
    },
  });
};

/**
 * Hook para actualizar una transacción
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionInput }) =>
      transactionsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.detail(variables.id) });
      toast.success('Transacción actualizada exitosamente');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar la transacción';
      toast.error(message);
    },
  });
};

/**
 * Hook para eliminar una transacción
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.lists() });
      toast.success('Transacción eliminada exitosamente');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error al eliminar la transacción';
      toast.error(message);
    },
  });
};
