// ========================
// INPUT FORMATTERS
// ========================

import { normalize } from "./bignumber";

/**
 * Format number input for real-time typing (handles user input)
 */
export const formatAmountInput = (raw: string, decimals = 6): string => {
  raw = raw.replace(/[^\d.]/g, "");

  if (raw === "") return "";

  const firstDotIndex = raw.indexOf(".");

  if (firstDotIndex !== -1) {
    raw =
      raw.slice(0, firstDotIndex + 1) +
      raw.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  if (raw.startsWith(".")) {
    raw = "0" + raw;
  }

  const [whole, fraction = ""] = raw.split(".");

  const normalizedWhole = whole.replace(/^0+(?=\d)/, "");

  const limitedFraction = fraction.slice(0, decimals);

  if (raw.endsWith(".") && limitedFraction === "") {
    return normalizedWhole + ".";
  }

  return limitedFraction.length > 0
    ? normalizedWhole + "." + limitedFraction
    : normalizedWhole;
};

/**
 * Clean formatted input back to raw number (remove commas, etc.)
 */
export function cleanNumberInput(formatted: string): string {
  return formatted.replace(/,/g, "");
}

// ========================
// DISPLAY FORMATTERS
// ========================

export interface FormatNumberOptions {
  decimals?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
  minDecimals?: number;
  maxDecimals?: number;
}

/**
 * Format number for display with full customization
 */
export function formatNumber(
  value: number | string,
  options: FormatNumberOptions = {},
): string {
  const {
    decimals,
    thousandSeparator = ",",
    decimalSeparator = ".",
    prefix = "",
    suffix = "",
    minDecimals,
    maxDecimals,
  } = options;

  // Convert to number
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Handle invalid numbers
  if (isNaN(num)) return "0";

  // Determine decimal places
  let decimalPlaces = decimals;

  if (decimalPlaces === undefined) {
    if (maxDecimals !== undefined) {
      // Use dynamic decimals with max limit
      const str = num.toString();
      const decimalIndex = str.indexOf(".");

      if (decimalIndex === -1) {
        decimalPlaces = minDecimals || 0;
      } else {
        const currentDecimals = str.length - decimalIndex - 1;

        decimalPlaces = Math.min(currentDecimals, maxDecimals);
        if (minDecimals !== undefined) {
          decimalPlaces = Math.max(decimalPlaces, minDecimals);
        }
      }
    } else {
      decimalPlaces = 2; // default
    }
  }

  // Format the number
  const formatted = num.toFixed(decimalPlaces);
  const [whole, fraction] = formatted.split(".");

  // Add thousand separators
  const wholeFormatted = whole.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator,
  );

  // Combine parts
  let result = wholeFormatted;

  if (fraction && decimalPlaces > 0) {
    result += decimalSeparator + fraction;
  }

  return prefix + result + suffix;
}
/**
 * Format number for display with full customization
 * This is a duplicate of the above function, but kept for compatibility
 * Remove this if not needed
 */
export function formatNumberNormalize({
  value,
  options,
  normalized,
}: {
  value: number | string;
  options?: FormatNumberOptions;
  normalized?: number;
}): string {
  const {
    decimals,
    thousandSeparator = ",",
    decimalSeparator = ".",
    prefix = "",
    suffix = "",
    minDecimals,
    maxDecimals,
  } = (options as FormatNumberOptions) || {};

  if (normalized) {
    value = normalize(value, normalized);
  }

  // Convert to number
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Handle invalid numbers
  if (isNaN(num)) return "0";

  // Determine decimal places
  let decimalPlaces = decimals;

  if (decimalPlaces === undefined) {
    if (maxDecimals !== undefined) {
      // Use dynamic decimals with max limit
      const str = num.toString();
      const decimalIndex = str.indexOf(".");

      if (decimalIndex === -1) {
        decimalPlaces = minDecimals || 0;
      } else {
        const currentDecimals = str.length - decimalIndex - 1;

        decimalPlaces = Math.min(currentDecimals, maxDecimals);
        if (minDecimals !== undefined) {
          decimalPlaces = Math.max(decimalPlaces, minDecimals);
        }
      }
    } else {
      decimalPlaces = 2; // default
    }
  }

  // Format the number
  const formatted = num.toFixed(decimalPlaces);
  const [whole, fraction] = formatted.split(".");

  // Add thousand separators
  const wholeFormatted = whole.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator,
  );

  // Combine parts
  let result = wholeFormatted;

  if (fraction && decimalPlaces > 0) {
    result += decimalSeparator + fraction;
  }

  return prefix + result + suffix;
}

/**
 * Format currency (shorthand for common currency formatting)
 */
export function formatRealCurrency(
  value: number | string,
  options: {
    symbol?: string;
    decimals?: number;
    symbolPosition?: "before" | "after";
  } = {},
): string {
  const { symbol = "$", decimals = 2, symbolPosition = "before" } = options;

  return formatNumber(value, {
    decimals,
    prefix: symbolPosition === "before" ? symbol : "",
    suffix: symbolPosition === "after" ? symbol : "",
  });
}

export function formatCurrency(value: number | string, decimals = 2): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num) || num === 0) return "$0.00";

  if (num < 0.01 && num > 0) {
    return `$<0.01`;
  }

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  }

  const formatted = num.toFixed(decimals);
  const [whole, fraction] = formatted.split(".");
  const wholeFormatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `$${wholeFormatted}.${fraction}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | string, decimals = 2): string {
  return formatNumber(value, {
    decimals,
    suffix: "%",
  });
}

/**
 * Format large numbers with K, M, B, T suffixes
 */
export function formatCompactNumber(
  value: number | string,
  decimals = 2,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1e12) {
    return sign + formatNumber(absNum / 1e12, { decimals }) + "T";
  } else if (absNum >= 1e9) {
    return sign + formatNumber(absNum / 1e9, { decimals }) + "B";
  } else if (absNum >= 1e6) {
    return sign + formatNumber(absNum / 1e6, { decimals }) + "M";
  } else if (absNum >= 1e3) {
    return sign + formatNumber(absNum / 1e3, { decimals }) + "K";
  }

  return formatNumber(num, { decimals });
}

/**
 * Format crypto amounts (handles very small decimals)
 */
export function formatCryptoAmount(
  value: number | string,
  options: {
    maxDecimals?: number;
    minDecimals?: number;
    showFullPrecision?: boolean;
  } = {},
): string {
  const {
    maxDecimals = 8,
    minDecimals = 0,
    showFullPrecision = false,
  } = options;

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num) || num === 0) return "0";

  if (showFullPrecision) {
    // Show full precision for very small numbers
    return num.toString();
  }

  // Dynamic decimals based on number size
  if (Math.abs(num) >= 1) {
    return formatNumber(num, {
      maxDecimals: Math.min(maxDecimals, 4),
      minDecimals,
    });
  } else if (Math.abs(num) >= 0.01) {
    return formatNumber(num, {
      maxDecimals: Math.min(maxDecimals, 18),
      minDecimals,
    });
  } else {
    return formatNumber(num, { maxDecimals, minDecimals });
  }
}

// ========================
// PARSING UTILITIES
// ========================

/**
 * Parse formatted number string back to number
 */
export function parseFormattedNumber(formatted: string): number {
  // Remove all non-digit characters except decimal point and minus sign
  const cleaned = formatted.replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);

  return isNaN(num) ? 0 : num;
}

/**
 * Check if string is a valid number
 */
export function isValidNumber(value: string): boolean {
  const cleaned = cleanNumberInput(value);

  return !isNaN(parseFloat(cleaned)) && isFinite(parseFloat(cleaned));
}

// ========================
// USAGE EXAMPLES
// ========================

/*
// Input formatting (for real-time typing)
formatAmountInput("1234.567890", 4) // "1,234.5678"
formatAmountInput("000123.45") // "123.45"
formatAmountInput(".123") // "0.123"

// Display formatting
formatNumber(1234.567, { decimals: 18 }) // "1,234.57"
formatNumber(1234.567, { 
  decimals: 18, 
  prefix: "$", 
  thousandSeparator: "." 
}) // "$1.234.57"

// Currency
formatCurrency(1234.56) // "$1,234.56"
formatCurrency(1234.56, { symbol: "€", symbolPosition: "after" }) // "1,234.56€"

// Percentage
formatPercentage(12.345) // "12.35%"

// Compact numbers
formatCompactNumber(1234567) // "1.2M"
formatCompactNumber(1234567890) // "1.2B"

// Crypto amounts
formatCryptoAmount(0.000000123456789) // "0.00000012"
formatCryptoAmount(123.456789) // "123.4568"

// Parsing
parseFormattedNumber("$1,234.56") // 1234.56
isValidNumber("1,234.56") // true
*/
