import { z } from 'zod';

// Schema de validación para transacción
export const transactionSchema = z.object({
  id: z.number().int().positive().optional(),
  amount: z.number().int().positive({ message: 'El monto debe ser mayor a 0' }),
  business: z
    .string()
    .min(1, 'El giro o comercio es requerido')
    .max(120, 'El giro o comercio no puede exceder 120 caracteres'),
  tenpista: z
    .string()
    .min(1, 'El nombre del Tenpista es requerido')
    .max(120, 'El nombre del Tenpista no puede exceder 120 caracteres'),
  date: z.string().datetime({ message: 'Fecha inválida' }),
});

// Schema para creación (sin id)
export const createTransactionSchema = transactionSchema.omit({ id: true });

// Schema para actualización (con id requerido)
export const updateTransactionSchema = transactionSchema.required({ id: true });

// Tipos TypeScript inferidos de los schemas
export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

// Tipos para formulario (con valores string para inputs)
export interface TransactionFormValues {
  id?: number;
  amount: string;
  business: string;
  tenpista: string;
  date: string;
}

// Parámetros de listado
export interface TransactionListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
