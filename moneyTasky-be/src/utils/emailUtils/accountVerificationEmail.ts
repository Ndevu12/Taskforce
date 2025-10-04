/**
 * Generate account verification email HTML template
 * 
 * @param name User's name
 * @param verificationToken Verification token
 * @param verificationUrl Verification URL
 * @returns HTML string for account verification email
 */
export const getAccountVerificationEmailTemplate = (name: string, verificationToken: string, verificationUrl: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name},</h2>
      <p>Thank you for creating an account with Money Tasky. To complete your registration, please verify your email address.</p>
      <p>Please click the button below to verify your email address:</p>
      <p>
        <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify My Email
        </a>
      </p>
      <p>Or use this verification code: <strong>${verificationToken}</strong></p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,</p>
      <p>The Money Tasky Team</p>
    </div>
  `;
};
