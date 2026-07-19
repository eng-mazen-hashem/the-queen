/**
 * @fileoverview Localization and formatting utilities for Queen's Attara.
 * Centralizes all currency, number, and locale formatting for the Egyptian market.
 *
 * @module lib/formatters
 * @author Queen's Attara Engineering
 */

/** The locale used for all formatting: Modern Standard Arabic (Egypt) */
export const LOCALE = 'ar-EG';

/** ISO 4217 currency code for Egyptian Pound */
export const CURRENCY_CODE = 'EGP';

/** Display symbol for Egyptian Pound */
export const CURRENCY_SYMBOL = 'ج.م';

/**
 * Formats a numeric price value into a localized Egyptian Pound string.
 * Uses `Intl.NumberFormat` for accurate Arabic-locale number formatting.
 *
 * @param {number} amount - The price amount to format.
 * @param {boolean} [arabicNumerals=false] - If true, renders Arabic-Indic numerals (٠١٢...).
 *   Defaults to false for Western numerals (0,1,2...) which are more readable in mixed UI.
 * @returns {string} Formatted price string, e.g. "١٢٫٥٠ ج.م" or "12.50 ج.م"
 *
 * @example
 * formatPrice(12.5)       // "12.50 ج.م"
 * formatPrice(1250, true) // "١٬٢٥٠٫٠٠ ج.م"
 */
export function formatPrice(amount: number, arabicNumerals = false): string {
  const locale = arabicNumerals ? LOCALE : 'en-EG';
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${CURRENCY_SYMBOL}`;
}

/**
 * Formats a total price for cart or order summaries.
 * Identical to `formatPrice` but semantically distinct for readability.
 *
 * @param {number} total - Total cart/order amount.
 * @returns {string} Formatted total, e.g. "245.00 ج.م"
 */
export function formatTotal(total: number): string {
  return formatPrice(total);
}

/**
 * Returns just the numeric part formatted for Arabic locale,
 * useful when the currency symbol is rendered separately in JSX.
 *
 * @param {number} amount - The numeric value.
 * @returns {string} Formatted number string without currency symbol, e.g. "12.50"
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
