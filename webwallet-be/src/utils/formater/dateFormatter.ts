/**
 * Format a date range as a string
 * 
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  // Check if dates are in the same month and year
  const sameMonth = startDate.getMonth() === endDate.getMonth() && 
                    startDate.getFullYear() === endDate.getFullYear();
  
  // Format options
  const monthYearOptions: Intl.DateTimeFormatOptions = { 
    month: 'long',
    year: 'numeric'
  };
  
  const dayOptions: Intl.DateTimeFormatOptions = { 
    day: 'numeric'
  };
  
  const fullDateOptions: Intl.DateTimeFormatOptions = { 
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };
  
  if (sameMonth) {
    // Format like "January 1-15, 2023"
    const monthYear = startDate.toLocaleDateString('en-US', monthYearOptions);
    const startDay = startDate.toLocaleDateString('en-US', dayOptions);
    const endDay = endDate.toLocaleDateString('en-US', dayOptions);
    return `${startDay}-${endDay} ${monthYear}`;
  } else {
    // Format like "January 15 - February 15, 2023"
    const startDateStr = startDate.toLocaleDateString('en-US', fullDateOptions);
    const endDateStr = endDate.toLocaleDateString('en-US', fullDateOptions);
    return `${startDateStr} - ${endDateStr}`;
  }
};

/**
 * Format a date for display
 * 
 * @param date Date to format
 * @param format Optional format style
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};
