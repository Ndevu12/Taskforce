/**
 * Send successful password reset email HTML template
 * 
 * @param name User's name
 * @returns HTML string for password reset email
 */
export const getSuccessfulPasswordResetEmailTemplate = (name: string) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>Your password has been successfully reset.</p>
        <p>If you did not request this change, please contact support immediately.</p>
        <p>Best regards,</p>
        <p>The Money Tasky Team</p>
        </div>
    `;
}