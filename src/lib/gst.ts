const GST_RATE = 0.18;

export interface GSTBreakdown {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

/**
 * Calculates GST based on a base amount (in INR rupees, non-paise)
 */
export function calculateGSTFromBase(baseAmount: number): GSTBreakdown {
  const gstAmount = Math.round(baseAmount * GST_RATE);
  return {
    baseAmount,
    gstAmount,
    totalAmount: baseAmount + gstAmount,
  };
}

/**
 * Deducts GST from a total inclusive amount (in INR rupees, non-paise)
 */
export function extractGSTFromTotal(totalAmount: number): GSTBreakdown {
  const baseAmount = Math.round(totalAmount / (1 + GST_RATE));
  const gstAmount = totalAmount - baseAmount;
  return {
    baseAmount,
    gstAmount,
    totalAmount,
  };
}
