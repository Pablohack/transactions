import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from '@tanstack/react-form';
import { FormField } from './FormField';

// Componente de prueba que usa FormField
const TestFormComponent = ({ onSubmit = vi.fn() }) => {
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => 
            !value ? 'Email es requerido' : undefined,
        }}
      >
        {(field) => (
          <FormField
            field={field}
            label="Email"
            type="email"
            placeholder="tu@email.com"
          />
        )}
      </form.Field>

      <form.Field name="name">
        {(field) => (
          <FormField
            field={field}
            label="Name"
            type="text"
          />
        )}
      </form.Field>

      <button type="submit">Submit</button>
    </form>
  );
};

describe('FormField Component', () => {
  it('should render field with label', () => {
    render(<TestFormComponent />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<TestFormComponent />);
    
    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should display validation error', async () => {
    const user = userEvent.setup();
    render(<TestFormComponent />);
    
    const emailInput = screen.getByLabelText('Email');
    
    // Focus y blur sin ingresar valor para disparar validación
    await user.click(emailInput);
    await user.tab();
    
    // La validación debería mostrar el error
    expect(await screen.findByText('Email es requerido')).toBeInTheDocument();
  });

  it('should clear error when valid input is provided', async () => {
    const user = userEvent.setup();
    render(<TestFormComponent />);
    
    const emailInput = screen.getByLabelText('Email');
    
    // Trigger error
    await user.click(emailInput);
    await user.tab();
    expect(await screen.findByText('Email es requerido')).toBeInTheDocument();
    
    // Fix error
    await user.click(emailInput);
    await user.type(emailInput, 'test@example.com');
    
    // Error should be gone
    expect(screen.queryByText('Email es requerido')).not.toBeInTheDocument();
  });

  it('should forward all input props', () => {
    render(<TestFormComponent />);
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'tu@email.com');
  });

  it('should disable input when form is submitting', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn(() => new Promise(() => {})); // Never resolves
    
    render(<TestFormComponent onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    // Fields should be disabled during submission
    expect(emailInput).toBeDisabled();
  });
});
