import transporter from '../../config/emailConfig';
import logger from '../../utils/logger';
import { getEnvVariable } from '../../config/getVariable';
import { 
  getWelcomeEmailTemplate, 
  getActivityNotificationEmailTemplate, 
  getPasswordResetEmailTemplate,
  getAccountVerificationEmailTemplate,
  getReportEmailTemplate
} from '../../utils/emailUtils';
import { getSuccessfulPasswordResetEmailTemplate } from '../../utils/emailUtils/passwordResetSuccessfull';

// Sender email from environment
const SENDER_EMAIL = getEnvVariable('AUTH_EMAIL');

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

/**
 * Send an email using the configured transporter
 * 
 * @param options Email options including recipients, subject, and content
 * @returns Promise resolving to the send result or error
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!options.text && !options.html) {
      throw new Error('Either text or html content must be provided');
    }

    const mailOptions = {
      from: `Money Tasky <${SENDER_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send a welcome email to a new user
 * 
 * @param name User's name
 * @param email User's email
 * @returns Promise resolving to the send result
 */
export const sendWelcomeEmail = async (name: string, email: string): Promise<boolean> => {
  const subject = 'Welcome to Money Tasky!';
  const html = getWelcomeEmailTemplate(name);

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send a notification email about account activity
 * 
 * @param name User's name
 * @param email User's email
 * @param activity Description of the activity
 * @returns Promise resolving to the send result
 */
export const sendActivityNotificationEmail = async (
  name: string,
  email: string,
  activity: string
): Promise<boolean> => {
  const subject = 'Money Tasky: Account Activity Notification';
  const html = getActivityNotificationEmailTemplate(name, activity);

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send a password reset email with a reset link
 * 
 * @param name User's name
 * @param email User's email
 * @param resetToken Reset token or code
 * @param resetUrl URL for password reset
 * @returns Promise resolving to the send result
 */
export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  resetToken: string,
  resetUrl: string
): Promise<boolean> => {
  const subject = 'Money Tasky: Password Reset Request';
  const html = getPasswordResetEmailTemplate(name, resetToken, resetUrl);

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send an account verification email
 * 
 * @param name User's name
 * @param email User's email
 * @param verificationToken Verification token or code
 * @param verificationUrl URL for email verification
 * @returns Promise resolving to the send result
 */
export const sendAccountVerificationEmail = async (
  name: string,
  email: string,
  verificationToken: string,
  verificationUrl: string
): Promise<boolean> => {
  const subject = 'Money Tasky: Verify Your Email Address';
  const html = getAccountVerificationEmailTemplate(name, verificationToken, verificationUrl);

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send a password reset success email
 * 
 * @param name User's name
 * @param email User's email
 * @returns Promise resolving to the send result
 */
export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string
): Promise<boolean> => {
  const subject = 'Money Tasky: Password Reset Successful';
  const html = getSuccessfulPasswordResetEmailTemplate(name);

  return await sendEmail({ to: email, subject, html });
}

/**
 * Send a financial report email to a user
 * 
 * @param name User's name
 * @param email User's email
 * @param reportTitle Title of the report
 * @param reportPeriod Period covered by the report
 * @param financialSummary Summary object containing financial data
 * @param attachmentPath Optional path to PDF attachment
 * @returns Promise resolving to the send result
 */
export const sendReportEmail = async (
  name: string,
  email: string,
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
      mostUsedCategories?: Record<string, string>
    }
  },
  attachmentPath?: string
): Promise<boolean> => {
  const subject = `Money Tasky: ${reportTitle} - ${reportPeriod}`;
  const html = getReportEmailTemplate(name, reportTitle, reportPeriod, financialSummary);

  const emailOptions: EmailOptions = { to: email, subject, html };
  
  // Add PDF attachment if provided
  if (attachmentPath) {
    emailOptions.attachments = [{
      filename: `${reportTitle.replace(/\s+/g, '_')}_${reportPeriod.replace(/\s+/g, '_')}.pdf`,
      path: attachmentPath,
      contentType: 'application/pdf'
    }];
  }
  
  return await sendEmail(emailOptions);
};
