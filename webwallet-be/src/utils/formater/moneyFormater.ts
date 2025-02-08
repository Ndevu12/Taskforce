export const formattedAmount = (amount: number): string => {

return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'RWF',
        minimumFractionDigits: 2
      }).format(amount);
}
