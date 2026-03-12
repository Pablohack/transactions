import React from 'react';
import { TransactionsTable, useTransactions } from '@/features/transactions';
import {
  TransactionPageHeader,
  DeleteTransactionModal,
  TransactionFormModal,
} from './components';
import { useTransactionActions } from './hooks';

export const TransactionsPage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useTransactions();
  console.log('TransactionsPage - data:', data, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);
  const {
    isFormModalOpen,
    selectedTransaction,
    transactionToDelete,
    isSubmitting,
    isDeleting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseFormModal,
  } = useTransactionActions();

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto">
        <TransactionPageHeader onCreateClick={handleCreate} />

        <div className="bg-surface-elevated border border-surface-border rounded-lg shadow-md p-6">
          <TransactionsTable
            data={(data) || []}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefetch={refetch}
          />
        </div>

        <TransactionFormModal
          isOpen={isFormModalOpen}
          transaction={selectedTransaction}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={handleCloseFormModal}
        />

        <DeleteTransactionModal
          transaction={transactionToDelete}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};
