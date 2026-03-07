import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un número como moneda chilena (CLP)
 * @param amount - Monto a formatear
 * @returns String formateado como CLP
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Parsea una string de moneda a número
 * @param currencyString - String de moneda a parsear
 * @returns Número parseado
 */
export const parseCurrency = (currencyString: string): number => {
  const cleanedString = currencyString.replace(/[^\d]/g, '');
  return parseInt(cleanedString, 10) || 0;
};

/**
 * Formatea una fecha en formato local (dd/MM/yyyy HH:mm)
 * @param date - Fecha a formatear (string ISO o Date)
 * @returns String formateado
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha para input datetime-local
 * @param date - Fecha a formatear
 * @returns String en formato yyyy-MM-dd'T'HH:mm
 */
export const formatDateForInput = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Convierte una fecha local a ISO string
 * @param date - Fecha a convertir
 * @returns String ISO
 */
export const toISOString = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error converting to ISO:', error);
    return new Date().toISOString();
  }
};
