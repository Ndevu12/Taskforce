/**
 * Generate activity notification email HTML template
 * 
 * @param name User's name
 * @param activity Description of the activity
 * @returns HTML string for activity notification email
 */
export const getActivityNotificationEmailTemplate = (name: string, activity: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name},</h2>
      <p>We detected the following activity on your account:</p>
      <p style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #4CAF50;">
        ${activity}
      </p>
      <p>If this was you, you can ignore this email. If you didn't perform this action, please contact our support team immediately.</p>
      <p>Best regards,</p>
      <p>The Money Tasky Team</p>
    </div>
  `;
};
