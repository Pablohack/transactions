import React from 'react';
import { Button, Modal } from '@/shared/ui';
import type { Transaction } from '@/features/transactions';

interface DeleteTransactionModalProps {
  transaction: Transaction | undefined;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  transaction,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={!!transaction}
      onClose={() => !isDeleting && onCancel()}
      title="Confirmar eliminación"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
            Eliminar
          </Button>
        </>
      }
    >
      <p className="text-text-secondary">
        ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
      </p>
      {transaction && (
        <div className="mt-4 p-3 bg-surface rounded border border-surface-border">
          <p className="text-sm text-text-primary">
            <span className="font-semibold">ID:</span> {transaction.id}
          </p>
          <p className="text-sm text-text-primary">
            <span className="font-semibold">Comercio:</span> {transaction.business}
          </p>
        </div>
      )}
    </Modal>
  );
};
