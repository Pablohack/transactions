import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionsTable } from './TransactionsTable';
import type { Transaction } from '../model';

describe('TransactionsTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnRefetch = vi.fn();

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      amount: 50000,
      business: 'Supermercado',
      tenpista: 'Juan Pérez',
      date: '2026-03-10T10:00:00',
    },
    {
      id: 2,
      amount: 25000,
      business: 'Farmacia',
      tenpista: 'María González',
      date: '2026-03-09T15:30:00',
    },
    {
      id: 3,
      amount: 75000,
      business: 'Restaurant',
      tenpista: 'Pedro López',
      date: '2026-03-08T12:00:00',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estados de carga', () => {
    it('debe mostrar el estado de carga cuando isLoading es true', () => {
      render(
        <TransactionsTable
          data={[]}
          isLoading={true}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText(/Cargando transacciones/i)).toBeInTheDocument();
    });

    it('debe mostrar el estado de error cuando isError es true', () => {
      const errorMessage = 'Error al cargar las transacciones';
      render(
        <TransactionsTable
          data={[]}
          isLoading={false}
          isError={true}
          error={new Error(errorMessage)}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
    });

    it('debe llamar a onRefetch cuando se hace click en reintentar', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsTable
          data={[]}
          isLoading={false}
          isError={true}
          error={new Error('Error')}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const retryButton = screen.getByRole('button', { name: /Reintentar/i });
      await user.click(retryButton);

      expect(mockOnRefetch).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar estado vacío cuando no hay transacciones', () => {
      render(
        <TransactionsTable
          data={[]}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText(/No hay transacciones/i)).toBeInTheDocument();
      expect(screen.getByText(/Comienza creando tu primera transacción/i)).toBeInTheDocument();
    });
  });

  describe('Renderizado de datos', () => {
    it('debe renderizar todas las transacciones en la tabla', () => {
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText('Supermercado')).toBeInTheDocument();
      expect(screen.getByText('Farmacia')).toBeInTheDocument();
      expect(screen.getByText('Restaurant')).toBeInTheDocument();
    });

    it('debe renderizar los headers de la tabla correctamente', () => {
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Monto')).toBeInTheDocument();
      expect(screen.getByText('Giro/Comercio')).toBeInTheDocument();
      expect(screen.getByText('Tenpista')).toBeInTheDocument();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });

    it('debe formatear el monto correctamente como moneda', () => {
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText('$50.000')).toBeInTheDocument();
      expect(screen.getByText('$25.000')).toBeInTheDocument();
      expect(screen.getByText('$75.000')).toBeInTheDocument();
    });

    it('debe mostrar el ID de todas las transacciones', () => {
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Acciones de la tabla', () => {
    it('debe llamar a onEdit con la transacción correcta al hacer click en editar', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const editButtons = screen.getAllByLabelText(/Editar transacción/i);
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockTransactions[0]);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onDelete con la transacción correcta al hacer click en eliminar', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/Eliminar transacción/i);
      await user.click(deleteButtons[1]);

      expect(mockOnDelete).toHaveBeenCalledWith(mockTransactions[1]);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('debe tener botones de editar y eliminar para cada fila', () => {
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const editButtons = screen.getAllByLabelText(/Editar transacción/i);
      const deleteButtons = screen.getAllByLabelText(/Eliminar transacción/i);

      expect(editButtons).toHaveLength(mockTransactions.length);
      expect(deleteButtons).toHaveLength(mockTransactions.length);
    });
  });

  describe('Paginación', () => {
    const manyTransactions: Transaction[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      amount: (i + 1) * 10000,
      business: `Comercio ${i + 1}`,
      tenpista: `Persona ${i + 1}`,
      date: '2026-03-10T10:00:00',
    }));

    it('debe mostrar 10 transacciones por página por defecto', () => {
      render(
        <TransactionsTable
          data={manyTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const rows = screen.getAllByRole('row');
      // 1 header + 10 filas de datos
      expect(rows).toHaveLength(11);
    });

    it('debe mostrar la información de paginación correcta', () => {
      render(
        <TransactionsTable
          data={manyTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      expect(screen.getByText(/Mostrando 1 a 10 de 25 transacciones/i)).toBeInTheDocument();
    });

    it('debe navegar a la siguiente página', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsTable
          data={manyTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      expect(screen.getByText(/Mostrando 11 a 20 de 25 transacciones/i)).toBeInTheDocument();
    });

    it('debe navegar a la página anterior', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsTable
          data={manyTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      const prevButton = screen.getByRole('button', { name: /Anterior/i });
      await user.click(prevButton);

      expect(screen.getByText(/Mostrando 1 a 10 de 25 transacciones/i)).toBeInTheDocument();
    });

    it('debe deshabilitar el botón Anterior en la primera página', () => {
      render(
        <TransactionsTable
          data={manyTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      const prevButton = screen.getByRole('button', { name: /Anterior/i });
      expect(prevButton).toBeDisabled();
    });

    it('debe deshabilitar el botón Siguiente en la última página', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsTable
          data={manyTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      // Navegar a la última página (página 3 de 3)
      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);
      await user.click(nextButton);

      expect(nextButton).toBeDisabled();
    });
  });

  describe('Ordenamiento', () => {
    it('debe mostrar indicadores de ordenamiento en los headers', () => {
      render(
        <TransactionsTable
          data={mockTransactions}
          isLoading={false}
          isError={false}
          error={null}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRefetch={mockOnRefetch}
        />
      );

      // Los headers que permiten ordenamiento deben tener el ícono
      const headers = screen.getAllByText('↕');
      expect(headers.length).toBeGreaterThan(0);
    });
  });
});
