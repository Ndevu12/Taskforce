/**
 * Generate welcome email HTML template
 * 
 * @param name User's name
 * @returns HTML string for welcome email
 */
export const getWelcomeEmailTemplate = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Money Tasky, ${name}!</h2>
      <p>Thank you for creating an account. We're excited to have you on board!</p>
      <p>With Money Tasky, you can:</p>
      <ul>
        <li>Track your expenses and income</li>
        <li>Create and manage budgets</li>
        <li>Get insights into your spending habits</li>
        <li>Set financial goals and track your progress</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Happy budgeting!</p>
      <p>The Money Tasky Team</p>
    </div>
  `;
};
