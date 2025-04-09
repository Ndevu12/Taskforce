/**
 * Generate password reset email HTML template
 * 
 * @param name User's name
 * @param resetToken Reset token
 * @param resetUrl Reset URL
 * @returns HTML string for password reset email
 */
export const getPasswordResetEmailTemplate = (name: string, resetToken: string, resetUrl: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password.</p>
      <p>Please click the link below to reset your password:</p>
      <p>
        <a href="${resetUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
          Reset My Password
        </a>
      </p>
      <p>Or use this reset code: <strong>${resetToken}</strong></p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,</p>
      <p>The Money Tasky Team</p>
    </div>
  `;
};
