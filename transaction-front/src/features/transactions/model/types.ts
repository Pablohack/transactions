import { z } from 'zod';

export const businessValidator = z
  .string()
  .min(1, 'El giro o comercio es requerido')
  .max(120, 'El giro o comercio no puede exceder 120 caracteres');

export const tenpistaValidator = z
  .string()
  .min(1, 'El nombre del Tenpista es requerido')
  .max(120, 'El nombre del Tenpista no puede exceder 120 caracteres');

export const amountFormValidator = z
  .string()
  .min(1, 'El monto es requerido')
  .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: 'El monto debe ser mayor a 0',
  })
  .refine((val) => parseInt(val, 10) <= 2147483647, {
    message: 'El monto excede el máximo permitido',
  });

export const dateFormValidator = z
  .string()
  .min(1, 'La fecha es requerida')
  .refine((val) => new Date(val) <= new Date(), {
    message: 'La fecha no puede ser futura',
  });

export const transactionSchema = z.object({
  id: z.number().int().positive().optional(),
  amount: z.number().int().positive({ message: 'El monto debe ser mayor a 0' }).max(2147483647, 'El monto excede el máximo permitido'),
  business: businessValidator,
  tenpista: tenpistaValidator,
  date: z.string().datetime({ message: 'Fecha inválida' }),
});

export const transactionFormSchema = z.object({
  id: z.number().optional(),
  amount: amountFormValidator,
  business: businessValidator,
  tenpista: tenpistaValidator,
  date: dateFormValidator,
});

// Schema para creación (sin id)
export const createTransactionSchema = transactionSchema.omit({ id: true });

// Schema para actualización (con id requerido)
export const updateTransactionSchema = transactionSchema.required({ id: true });

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export interface TransactionListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}