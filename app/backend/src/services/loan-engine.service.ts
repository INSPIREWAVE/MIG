export type InstallmentInput = {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
};

export const calculateInstallment = ({ principal, annualRatePercent, termMonths }: InstallmentInput): number => {
  const monthlyRate = annualRatePercent / 12 / 100;
  if (monthlyRate === 0) return principal / termMonths;

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};
