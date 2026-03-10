import React from 'react';
import { Button } from '@/shared/ui';

interface TransactionPageHeaderProps {
  onCreateClick: () => void;
}

export const TransactionPageHeader: React.FC<TransactionPageHeaderProps> = ({
  onCreateClick,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Transacciones</h1>
        <p className="text-text-secondary mt-1">Gestiona tus transacciones de Tenpo</p>
      </div>
      <Button onClick={onCreateClick} variant="primary" size="lg">
        + Nueva Transacción
      </Button>
    </div>
  );
};
