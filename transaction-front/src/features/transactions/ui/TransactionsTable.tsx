import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@/shared/lib';
import { Button, LoadingState, EmptyState, ErrorState } from '@/shared/ui';
import type { Transaction } from '../model';

interface TransactionsTableProps {
  data: Transaction[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onRefetch: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  data,
  isLoading,
  isError,
  error,
  onEdit,
  onDelete,
  onRefetch,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  console.log('TransactionsTable render - data:', data);
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => <span className="font-mono text-sm">{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: (info) => (
        <span className="font-semibold text-primary">
          {formatCurrency(info.getValue() as number)}
        </span>
      ),
    },
    {
      accessorKey: 'business',
      header: 'Giro/Comercio',
      cell: (info) => <span className="text-text-primary">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'tenpista',
      header: 'Tenpista',
      cell: (info) => <span className="text-text-primary">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: (info) => (
        <span className="text-text-secondary text-sm">
          {formatDate(info.getValue() as string)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="text-primary hover:text-primary-hover transition-colors"
            aria-label="Editar transacción"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(row.original)}
            className="text-error hover:text-red-600 transition-colors"
            aria-label="Eliminar transacción"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return <LoadingState message="Cargando transacciones..." />;
  }

  if (isError) {
    const message = error instanceof Error ? error.message : 'Error al cargar las transacciones';
    return (
      <ErrorState
        message={message}
        onRetry={onRefetch}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No hay transacciones"
        description="Comienza creando tu primera transacción"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-surface-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-text-primary"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-2 hover:text-primary'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-xs">
                            {{
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted() as string] ?? '↕'}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-surface-border hover:bg-surface-elevated transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
        <div className="text-sm text-text-secondary">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{' '}
          de {data.length} transacciones
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
