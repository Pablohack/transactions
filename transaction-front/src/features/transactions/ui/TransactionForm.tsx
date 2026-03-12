import React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button, FormField } from '@/shared/ui';
import { formatDateForInput, toISOString } from '@/shared/lib';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../model';
import {
  amountFormValidator,
  businessValidator,
  tenpistaValidator,
  dateFormValidator,
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
      <form.Field name="amount" validators={{ onChange: amountFormValidator }}>
        {(field) => (
          <FormField
            field={field}
            label="Monto (CLP) *"
            type="number"
            placeholder="Ej: 50000"
            min="1"
            step="1"
            disabled={isSubmitting}
          />
        )}
      </form.Field>

      {/* Giro/Comercio */}
      <form.Field name="business" validators={{ onChange: businessValidator }}>
        {(field) => (
          <FormField
            field={field}
            label="Giro/Comercio *"
            type="text"
            placeholder="Ej: Supermercado"
            maxLength={120}
            disabled={isSubmitting}
          />
        )}
      </form.Field>

      {/* Tenpista */}
      <form.Field name="tenpista" validators={{ onChange: tenpistaValidator }}>
        {(field) => (
          <FormField
            field={field}
            label="Nombre de Tenpista *"
            type="text"
            placeholder="Ej: Juan Pérez"
            maxLength={120}
            disabled={isSubmitting}
          />
        )}
      </form.Field>

      {/* Fecha */}
      <form.Field name="date" validators={{ onChange: dateFormValidator }}>
        {(field) => (
          <FormField
            field={field}
            label="Fecha de transacción *"
            type="datetime-local"
            disabled={isSubmitting}
          />
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
