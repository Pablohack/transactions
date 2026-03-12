import { axiosClient } from '@/shared/lib';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionListParams,
} from '../model';

const BASE_PATH = '/transactions';

export const transactionsApi = {
  /**
   * Obtiene el listado de transacciones con filtros y paginación
   */
  getAll: async (params?: TransactionListParams): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>(BASE_PATH, { params });
    return response.data;
  },

  /**
   * Obtiene una transacción por ID
   */
  getById: async (id: number): Promise<Transaction> => {
    const response = await axiosClient.get<Transaction>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva transacción
   */
  create: async (data: CreateTransactionInput): Promise<Transaction> => {
    const response = await axiosClient.post<Transaction>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Actualiza una transacción existente
   */
  update: async (id: number, data: UpdateTransactionInput): Promise<Transaction> => {
    const response = await axiosClient.put<Transaction>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una transacción
   */
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`${BASE_PATH}/${id}`);
  },
};
