import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  it('should render with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should render without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('should display helper text when no error', () => {
    render(<Input label="Email" helperText="We'll never share your email" />);
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
  });

  it('should not display helper text when there is an error', () => {
    render(
      <Input 
        label="Email" 
        error="Email is required" 
        helperText="We'll never share your email" 
      />
    );
    expect(screen.queryByText("We'll never share your email")).not.toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should apply error styles when error is present', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByLabelText('Email')).toHaveClass('border-error');
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    
    const input = screen.getByLabelText('Name');
    await user.type(input, 'John Doe');
    
    expect(input).toHaveValue('John Doe');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('should have correct accessibility attributes', () => {
    render(<Input label="Email" error="Email is required" />);
    const input = screen.getByLabelText('Email');
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('should accept custom className', () => {
    render(<Input label="Email" className="custom-class" />);
    expect(screen.getByLabelText('Email')).toHaveClass('custom-class');
  });
});
