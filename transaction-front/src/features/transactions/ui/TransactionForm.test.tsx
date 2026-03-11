import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from './TransactionForm';
import type { Transaction } from '../model';

describe('TransactionForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Creación de transacción', () => {
    it('debe renderizar el formulario vacío para crear una nueva transacción', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/Monto \(CLP\)/i)).toHaveValue(null);
      expect(screen.getByLabelText(/Giro\/Comercio/i)).toHaveValue('');
      expect(screen.getByLabelText(/Nombre de Tenpista/i)).toHaveValue('');
      expect(screen.getByRole('button', { name: /Crear Transacción/i })).toBeInTheDocument();
    });

    it('debe validar campos requeridos al intentar enviar el formulario vacío', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByRole('button', { name: /Crear Transacción/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/El monto es requerido/i)).toBeInTheDocument();
        expect(screen.getByText(/El giro o comercio es requerido/i)).toBeInTheDocument();
        expect(screen.getByText(/El nombre del Tenpista es requerido/i)).toBeInTheDocument();
        expect(screen.getByText(/La fecha es requerida/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('debe validar que el monto sea mayor a 0', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const amountInput = screen.getByLabelText(/Monto \(CLP\)/i);
      await user.type(amountInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/El monto debe ser mayor a 0/i)).toBeInTheDocument();
      });
    });

    it('debe validar que el monto no exceda el máximo permitido', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const amountInput = screen.getByLabelText(/Monto \(CLP\)/i);
      await user.type(amountInput, '2147483648'); // Máximo + 1
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/El monto excede el máximo permitido/i)).toBeInTheDocument();
      });
    });

    it('debe limitar los campos de texto a 120 caracteres mediante maxlength', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const longText = 'a'.repeat(150);
      const businessInput = screen.getByLabelText(/Giro\/Comercio/i) as HTMLInputElement;
      
      await user.type(businessInput, longText);

      // El maxlength HTML limita a 120 caracteres
      expect(businessInput.value.length).toBe(120);
    });

    it('debe crear una transacción con datos válidos', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/Monto \(CLP\)/i), '50000');
      await user.type(screen.getByLabelText(/Giro\/Comercio/i), 'Supermercado');
      await user.type(screen.getByLabelText(/Nombre de Tenpista/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/Fecha de transacción/i), '2026-03-10T14:30');

      const submitButton = screen.getByRole('button', { name: /Crear Transacción/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 50000,
            business: 'Supermercado',
            tenpista: 'Juan Pérez',
            date: expect.stringContaining('2026-03-10'),
          })
        );
      });
    });
  });

  describe('Edición de transacción', () => {
    const existingTransaction: Transaction = {
      id: 1,
      amount: 25000,
      business: 'Farmacia',
      tenpista: 'María González',
      date: '2026-03-09T10:00:00',
    };

    it('debe renderizar el formulario con datos de la transacción existente', () => {
      render(
        <TransactionForm
          transaction={existingTransaction}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/Monto \(CLP\)/i)).toHaveValue(25000);
      expect(screen.getByLabelText(/Giro\/Comercio/i)).toHaveValue('Farmacia');
      expect(screen.getByLabelText(/Nombre de Tenpista/i)).toHaveValue('María González');
      expect(screen.getByRole('button', { name: /Actualizar Transacción/i })).toBeInTheDocument();
    });

    it('debe actualizar una transacción existente', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          transaction={existingTransaction}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const amountInput = screen.getByLabelText(/Monto \(CLP\)/i);
      await user.clear(amountInput);
      await user.type(amountInput, '30000');

      const submitButton = screen.getByRole('button', { name: /Actualizar Transacción/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 1,
            amount: 30000,
            business: 'Farmacia',
            tenpista: 'María González',
          })
        );
      });
    });
  });

  describe('Interacciones del formulario', () => {
    it('debe llamar a onCancel cuando se hace click en el botón Cancelar', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('debe deshabilitar los inputs cuando isSubmitting es true', () => {
      render(
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isSubmitting={true} />
      );

      expect(screen.getByLabelText(/Monto \(CLP\)/i)).toBeDisabled();
      expect(screen.getByLabelText(/Giro\/Comercio/i)).toBeDisabled();
      expect(screen.getByLabelText(/Nombre de Tenpista/i)).toBeDisabled();
      expect(screen.getByLabelText(/Fecha de transacción/i)).toBeDisabled();
    });

    it('debe mostrar el botón con estado de carga cuando isSubmitting es true', () => {
      render(
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isSubmitting={true} />
      );

      const submitButton = screen.getByRole('button', { name: /Cargando/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Validación de fecha', () => {
    it('debe validar que la fecha no sea futura', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().slice(0, 16);

      const dateInput = screen.getByLabelText(/Fecha de transacción/i);
      await user.type(dateInput, futureDateString);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/La fecha no puede ser futura/i)).toBeInTheDocument();
      });
    });
  });
});
