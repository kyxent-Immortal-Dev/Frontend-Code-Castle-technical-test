/**
 * Convierte un valor a número de manera segura
 * @param value - El valor a convertir (string | number)
 * @returns El número convertido o 0 si no es válido
 */
export const safeNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Formatea un número como moneda
 * @param value - El valor a formatear (string | number)
 * @param currency - La moneda (por defecto USD)
 * @param locale - El locale (por defecto es-ES)
 * @returns El valor formateado como moneda
 */
export const formatCurrency = (value: string | number | null | undefined, currency: string = 'USD', locale: string = 'es-ES'): string => {
  const number = safeNumber(value);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(number);
};

/**
 * Formatea un número con decimales específicos
 * @param value - El valor a formatear (string | number)
 * @param decimals - El número de decimales (por defecto 2)
 * @returns El valor formateado
 */
export const formatDecimal = (value: string | number | null | undefined, decimals: number = 2): string => {
  const number = safeNumber(value);
  return number.toFixed(decimals);
}; 