import { TaxResult } from '../types';

/**
 * Calculates the Income Tax based on 2026 Wage Earner (Ücretli) brackets.
 * Data based on G.V.K. Article 103 draft provided in prompt.
 */
export const calculateTax = (income: number): TaxResult => {
  let incomeTax = 0;

  // Bracket logic specifically for "Ücret Gelirleri" (Wage Income)
  if (income <= 190000) {
    incomeTax = income * 0.15;
  } else if (income <= 400000) {
    incomeTax = 28500 + (income - 190000) * 0.20;
  } else if (income <= 1500000) {
    // Note: 1.5M limit for wages (vs 1M for non-wages)
    incomeTax = 70500 + (income - 400000) * 0.27;
  } else if (income <= 5300000) {
    // Note: 5.3M limit
    // Base tax calculation check: 70,500 + (1,500,000 - 400,000) * 0.27 = 70,500 + 297,000 = 367,500. Correct.
    incomeTax = 367500 + (income - 1500000) * 0.35;
  } else {
    // Over 5.3M
    // Base tax calculation check: 367,500 + (5,300,000 - 1,500,000) * 0.35 = 367,500 + 1,330,000 = 1,697,500. Correct.
    incomeTax = 1697500 + (income - 5300000) * 0.40;
  }

  const effectiveIncomeTaxRate = income > 0 ? (incomeTax / income) * 100 : 0;
  
  // Corporate Tax is fixed at 25%
  const corporateTaxRate = 25;
  const corporateTaxAmount = income * 0.25;

  // Difference: Income Tax - Corporate Tax
  // If positive, Income Tax is higher (Corp advantage)
  // If negative, Income Tax is lower (Corp disadvantage)
  const differenceAmount = incomeTax - corporateTaxAmount;
  const isCorporateAdvantage = differenceAmount > 0;
  
  // Percentage of savings relative to the income
  const advantagePercentage = income > 0 ? (Math.abs(differenceAmount) / income) * 100 : 0;

  return {
    income,
    incomeTaxAmount: incomeTax,
    effectiveIncomeTaxRate,
    corporateTaxAmount,
    corporateTaxRate,
    differenceAmount,
    isCorporateAdvantage,
    advantagePercentage
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (rate: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate / 100);
};
