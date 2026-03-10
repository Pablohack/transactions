import React from 'react';
import { Modal } from '@/shared/ui';
import {
  TransactionForm,
  type Transaction,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from '@/features/transactions';

interface TransactionFormModalProps {
  isOpen: boolean;
  transaction: Transaction | undefined;
  isSubmitting: boolean;
  onSubmit: (data: CreateTransactionInput | UpdateTransactionInput) => void;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  transaction,
  isSubmitting,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={transaction ? 'Editar Transacción' : 'Crear Transacción'}
      size="md"
    >
      <TransactionForm
        transaction={transaction}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
