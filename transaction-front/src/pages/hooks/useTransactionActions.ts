import { useState } from 'react';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  type Transaction,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from '@/features/transactions';

export const useTransactionActions = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | undefined>();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleCreate = () => {
    setSelectedTransaction(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
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
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete?.id) {
      await deleteMutation.mutateAsync(transactionToDelete.id);
      setTransactionToDelete(undefined);
    }
  };

  const handleCancelDelete = () => {
    setTransactionToDelete(undefined);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    // Estado
    isFormModalOpen,
    selectedTransaction,
    transactionToDelete,
    isSubmitting,
    isDeleting: deleteMutation.isPending,
    
    // Acciones
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseFormModal,
  };
};
