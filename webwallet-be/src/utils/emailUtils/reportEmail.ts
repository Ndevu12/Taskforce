import { formattedAmount } from "../formater/moneyFormater";

/**
 * Generate comprehensive financial report email HTML template
 * 
 * @param name User's name
 * @param reportTitle Report title
 * @param reportPeriod Period covered by the report (e.g., "January 2023")
 * @param financialSummary Summary object containing financial data
 * @returns HTML string for report email
 */
export const getReportEmailTemplate = (
  name: string,
  reportTitle: string,
  reportPeriod: string,
  financialSummary: {
    income: { total: number, categories: Record<string, number> },
    expenses: { total: number, categories: Record<string, number> },
    savings: { total: number, categories: Record<string, number> },
    investments?: { total: number, categories: Record<string, number> },
    debt?: { total: number, categories: Record<string, number> },
    credit?: { total: number, categories: Record<string, number> },
    netIncome: number,
    statistics?: {
      totalTransactions: number,
      mostActiveDay?: string,
      mostUsedCategories?: Record<string, string>,
    }
  }
): string => {
  
  // Generate table rows for categories
  const generateCategoryRows = (categories: Record<string, number>): string => {
    return Object.entries(categories)
      .map(([category, amount]) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${category}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">${formattedAmount(amount)}</td>
        </tr>
      `)
      .join('');
  };

  // Color coding for positive/negative values
  const getAmountColor = (amount: number): string => {
    return amount >= 0 ? '#28a745' : '#dc3545';
  };

  // Generate a percent change indicator
  const getPercentChange = (current: number, previous: number): string => {
    if (previous === 0) return '';
    const change = ((current - previous) / Math.abs(previous)) * 100;
    const symbol = change >= 0 ? '↑' : '↓';
    return `<span style="color: ${change >= 0 ? '#28a745' : '#dc3545'}; font-size: 0.85em;">
      ${symbol} ${Math.abs(change).toFixed(1)}%
    </span>`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reportTitle}</title>
      <style>
        @media only screen and (max-width: 620px) {
          table.body {
            width: 100% !important;
          }
          .container {
            width: 100% !important;
            padding: 0 !important;
          }
          .content {
            padding: 0 !important;
          }
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .summary-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section-header {
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 5px;
          font-weight: bold;
          margin-top: 20px;
          color: #2c3e50;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .data-table th {
          background-color: #f2f2f2;
          text-align: left;
          padding: 10px;
        }
        .data-table td {
          vertical-align: top;
        }
        .stat-box {
          display: inline-block;
          width: 30%;
          padding: 10px;
          text-align: center;
          background: #f9f9f9;
          border-radius: 5px;
          margin: 0 1%;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
        }
        .stat-value {
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4CAF50; padding: 20px; color: white; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">${reportTitle}</h2>
          <p style="margin: 5px 0 0 0;">${reportPeriod}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e0e0e0;">
          <p>Hello ${name},</p>
          <p>Here is your financial report for ${reportPeriod}. This summary provides an overview of your income, expenses, and account balances.</p>
          
          <!-- Financial Summary Card -->
          <div class="summary-card">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 10px; width: 50%;">
                  <div style="font-size: 14px; color: #666;">Total Income</div>
                  <div style="font-size: 20px; font-weight: bold; color: #28a745;">${formattedAmount(financialSummary.income.total)}</div>
                </td>
                <td style="padding: 5px 10px; width: 50%;">
                  <div style="font-size: 14px; color: #666;">Total Expenses</div>
                  <div style="font-size: 20px; font-weight: bold; color: #dc3545;">${formattedAmount(financialSummary.expenses.total)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 5px 10px; width: 50%;">
                  <div style="font-size: 14px; color: #666;">Total Savings</div>
                  <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">${formattedAmount(financialSummary.savings.total)}</div>
                </td>
                <td style="padding: 5px 10px; width: 50%;">
                  <div style="font-size: 14px; color: #666;">Net Income</div>
                  <div style="font-size: 20px; font-weight: bold; color: ${getAmountColor(financialSummary.netIncome)};">
                    ${formattedAmount(financialSummary.netIncome)}
                  </div>
                </td>
              </tr>
              ${financialSummary.statistics ? `
              <tr>
                <td colspan="2" style="padding: 10px 0 5px 10px;">
                  <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Transaction Statistics</div>
                  <div style="display: flex; justify-content: space-between;">
                    <div class="stat-box">
                      <div class="stat-label">Total Transactions</div>
                      <div class="stat-value">${financialSummary.statistics.totalTransactions}</div>
                    </div>
                    ${financialSummary.statistics.mostActiveDay ? `
                    <div class="stat-box">
                      <div class="stat-label">Most Active Day</div>
                      <div class="stat-value">${financialSummary.statistics.mostActiveDay}</div>
                    </div>
                    ` : ''}
                  </div>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <!-- Income Section -->
          <h3 class="section-header">Income Statement</h3>
          
          <h4 style="color: #28a745; margin-bottom: 5px;">Income</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${generateCategoryRows(financialSummary.income.categories)}
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; border-top: 2px solid #28a745;">Total Income</td>
                <td style="padding: 10px 12px; font-weight: bold; text-align: right; border-top: 2px solid #28a745; color: #28a745;">
                  ${formattedAmount(financialSummary.income.total)}
                </td>
              </tr>
            </tbody>
          </table>
          
          <h4 style="color: #dc3545; margin-bottom: 5px;">Expenses</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${generateCategoryRows(financialSummary.expenses.categories)}
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; border-top: 2px solid #dc3545;">Total Expenses</td>
                <td style="padding: 10px 12px; font-weight: bold; text-align: right; border-top: 2px solid #dc3545; color: #dc3545;">
                  ${formattedAmount(financialSummary.expenses.total)}
                </td>
              </tr>
            </tbody>
          </table>
          
          <h4 style="color: #17a2b8; margin-bottom: 5px;">Savings</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${generateCategoryRows(financialSummary.savings.categories)}
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; border-top: 2px solid #17a2b8;">Total Savings</td>
                <td style="padding: 10px 12px; font-weight: bold; text-align: right; border-top: 2px solid #17a2b8; color: #17a2b8;">
                  ${formattedAmount(financialSummary.savings.total)}
                </td>
              </tr>
            </tbody>
          </table>

          ${financialSummary.investments ? `
          <h4 style="color: #6f42c1; margin-bottom: 5px;">Investments</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${generateCategoryRows(financialSummary.investments.categories)}
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; border-top: 2px solid #6f42c1;">Total Investments</td>
                <td style="padding: 10px 12px; font-weight: bold; text-align: right; border-top: 2px solid #6f42c1; color: #6f42c1;">
                  ${formattedAmount(financialSummary.investments.total)}
                </td>
              </tr>
            </tbody>
          </table>
          ` : ''}
          
          <!-- Net Income Section -->
          <div style="margin: 30px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <table style="width: 100%;">
              <tr>
                <td style="font-size: 18px; font-weight: bold; width: 60%;">Net Income</td>
                <td style="font-size: 18px; font-weight: bold; text-align: right; color: ${getAmountColor(financialSummary.netIncome)};">
                  ${formattedAmount(financialSummary.netIncome)}
                </td>
              </tr>
            </table>
          </div>

          <p style="margin-top: 30px;">
            To view more details about your financial activities, please log into your Money Tasky account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Full Report
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>Money Tasky Financial Services</p>
          <p>© ${new Date().getFullYear()} Money Tasky. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
