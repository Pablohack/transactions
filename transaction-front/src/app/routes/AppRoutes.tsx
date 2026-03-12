import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingState } from '@/shared/ui';

const TransactionsPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.TransactionsPage }))
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState message="Cargando aplicación..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/transactions" replace />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="*" element={<Navigate to="/transactions" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
