const formatMoney = (amount: number, currency: string = 'FRW'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (amount >= 1_000_000_000) {
    return formatter.format(amount / 1_000_000_000) + 'B';
  } else if (amount >= 1_000_000) {
    return formatter.format(amount / 1_000_000) + 'M';
  } else if (amount >= 1_000) {
    return formatter.format(amount / 1_000) + 'K';
  } else {
    return formatter.format(amount);
  }
};

export default formatMoney;