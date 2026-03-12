import React from 'react';
import type { FieldApi } from '@tanstack/react-form';
import { Input, type InputProps } from './Input';

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'Error de validación';
};

export interface FormFieldProps extends Omit<InputProps, 'error' | 'value' | 'onChange' | 'onBlur'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
}

export const FormField: React.FC<FormFieldProps> = ({ field, disabled, ...inputProps }) => {
  const hasError = field.state.meta.errors.length > 0;
  const errorMessage = hasError ? getErrorMessage(field.state.meta.errors[0]) : undefined;

  return (
    <Input
      {...inputProps}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={errorMessage}
      disabled={disabled}
    />
  );
};

FormField.displayName = 'FormField';
