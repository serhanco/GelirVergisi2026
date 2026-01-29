export interface TaxResult {
  income: number;
  incomeTaxAmount: number;
  effectiveIncomeTaxRate: number;
  corporateTaxAmount: number;
  corporateTaxRate: number;
  differenceAmount: number; // Positive means Corporate Tax is cheaper
  isCorporateAdvantage: boolean;
  advantagePercentage: number;
}

export interface TaxBracket {
  limit: number;
  rate: number;
  baseTax: number;
  prevLimit: number;
}
