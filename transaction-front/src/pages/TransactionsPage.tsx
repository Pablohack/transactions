import React, { useState } from 'react';
import { Button, Modal } from '@/shared/ui';
import {
  TransactionsTable,
  TransactionForm,
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  type Transaction,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from '@/features/transactions';

export const TransactionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | undefined>();

  const { data, isLoading, isError, error, refetch } = useTransactions();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleCreate = () => {
    setSelectedTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteMutation.mutateAsync(transactionToDelete.id!);
      setTransactionToDelete(undefined);
    }
  };

  const handleSubmit = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    if (selectedTransaction?.id) {
      await updateMutation.mutateAsync({
        id: selectedTransaction.id,
        data: data as UpdateTransactionInput,
      });
    } else {
      await createMutation.mutateAsync(data as CreateTransactionInput);
    }
    setIsModalOpen(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Transacciones</h1>
            <p className="text-text-secondary mt-1">Gestiona tus transacciones de Tenpo</p>
          </div>
          <Button onClick={handleCreate} variant="primary" size="lg">
            + Nueva Transacción
          </Button>
        </div>

        {/* Tabla */}
        <div className="bg-surface-elevated border border-surface-border rounded-lg shadow-md p-6">
          <TransactionsTable
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefetch={refetch}
          />
        </div>

        {/* Modal de crear/editar */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => !isSubmitting && setIsModalOpen(false)}
          title={selectedTransaction ? 'Editar Transacción' : 'Crear Transacción'}
          size="md"
        >
          <TransactionForm
            transaction={selectedTransaction}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        {/* Modal de confirmación de eliminar */}
        <Modal
          isOpen={!!transactionToDelete}
          onClose={() => !deleteMutation.isPending && setTransactionToDelete(undefined)}
          title="Confirmar eliminación"
          size="sm"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setTransactionToDelete(undefined)}
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={deleteMutation.isPending}
              >
                Eliminar
              </Button>
            </>
          }
        >
          <p className="text-text-secondary">
            ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
          </p>
          {transactionToDelete && (
            <div className="mt-4 p-3 bg-surface rounded border border-surface-border">
              <p className="text-sm text-text-primary">
                <span className="font-semibold">ID:</span> {transactionToDelete.id}
              </p>
              <p className="text-sm text-text-primary">
                <span className="font-semibold">Comercio:</span> {transactionToDelete.business}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
