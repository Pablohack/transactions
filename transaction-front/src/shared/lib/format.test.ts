import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, parseCurrency } from '@/shared/lib';

describe('Format utilities', () => {
  describe('formatCurrency', () => {
    it('should format numbers as Chilean pesos', () => {
      expect(formatCurrency(1000)).toBe('$1.000');
      expect(formatCurrency(1000000)).toBe('$1.000.000');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should not show decimals', () => {
      expect(formatCurrency(1000.50)).toBe('$1.001');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings to numbers', () => {
      expect(parseCurrency('$1.000')).toBe(1000);
      expect(parseCurrency('$1.000.000')).toBe(1000000);
      expect(parseCurrency('1000')).toBe(1000);
    });

    it('should return 0 for invalid strings', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('abc')).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('should format ISO dates', () => {
      const isoDate = '2024-03-06T15:30:00Z';
      const formatted = formatDate(isoDate);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/);
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-03-06T15:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/);
    });

    it('should return error message for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Fecha inválida');
    });
  });
});
