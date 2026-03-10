import React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/shared/ui';
import { formatDateForInput, toISOString } from '@/shared/lib';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../model';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: CreateTransactionInput | UpdateTransactionInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditMode = !!transaction?.id;

  const form = useForm({
    defaultValues: {
      id: transaction?.id,
      amount: transaction?.amount?.toString() || '',
      business: transaction?.business || '',
      tenpista: transaction?.tenpista || '',
      date: transaction?.date ? formatDateForInput(transaction.date) : '',
    },
    onSubmit: async ({ value }) => {
      const data = {
        ...(isEditMode && { id: value.id }),
        amount: parseInt(value.amount, 10),
        business: value.business,
        tenpista: value.tenpista,
        date: toISOString(value.date),
      };
      onSubmit(data as CreateTransactionInput | UpdateTransactionInput);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Monto */}
      <form.Field
        name="amount"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El monto es requerido';
            const num = parseInt(value, 10);
            if (isNaN(num) || num <= 0) return 'El monto debe ser mayor a 0';
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-1">
              Monto (CLP) *
            </label>
            <input
              id="amount"
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 bg-surface-elevated border border-surface-border rounded text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${field.state.meta.errors.length > 0 ? 'border-error focus:ring-error' : ''}`}
              placeholder="Ej: 50000"
              min="1"
              step="1"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-error">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Giro/Comercio */}
      <form.Field
        name="business"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El giro o comercio es requerido';
            if (value.length < 1 || value.length > 120)
              return 'Debe tener entre 1 y 120 caracteres';
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="business" className="block text-sm font-medium text-text-primary mb-1">
              Giro/Comercio *
            </label>
            <input
              id="business"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 bg-surface-elevated border border-surface-border rounded text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${field.state.meta.errors.length > 0 ? 'border-error focus:ring-error' : ''}`}
              placeholder="Ej: Supermercado"
              maxLength={120}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-error">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Tenpista */}
      <form.Field
        name="tenpista"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El nombre del Tenpista es requerido';
            if (value.length < 1 || value.length > 120)
              return 'Debe tener entre 1 y 120 caracteres';
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="tenpista" className="block text-sm font-medium text-text-primary mb-1">
              Nombre de Tenpista *
            </label>
            <input
              id="tenpista"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 bg-surface-elevated border border-surface-border rounded text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${field.state.meta.errors.length > 0 ? 'border-error focus:ring-error' : ''}`}
              placeholder="Ej: Juan Pérez"
              maxLength={120}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-error">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Fecha */}
      <form.Field
        name="date"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'La fecha es requerida';
            if (value > formatDateForInput(new Date())) return 'La fecha no puede ser futura';

            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-primary mb-1">
              Fecha de transacción *
            </label>
            <input
              id="date"
              type="datetime-local"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 bg-surface-elevated border border-surface-border rounded text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${field.state.meta.errors.length > 0 ? 'border-error focus:ring-error' : ''}`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-error">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditMode ? 'Actualizar' : 'Crear'} Transacción
        </Button>
      </div>
    </form>
  );
};
