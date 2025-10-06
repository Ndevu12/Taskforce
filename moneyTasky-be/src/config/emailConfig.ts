import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getEnvVariable } from './getVariable';
import logger from '../utils/logger';

// Get email configuration from environment variables
const EMAIL_HOST = getEnvVariable('HOST');
const EMAIL_USER = getEnvVariable('AUTH_EMAIL');
const EMAIL_PASSWORD = getEnvVariable('AUTH_PASSWORD');
const EMAIL_PORT = 587;
const EMAIL_SECURE = false;

let transporter: nodemailer.Transporter | null = null;

if (EMAIL_HOST && EMAIL_USER && EMAIL_PASSWORD) {
  const smtpConfig: SMTPTransport.Options = {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  transporter = nodemailer.createTransport(smtpConfig);

  // Verify connection configuration
  transporter.verify()
    .then(() => {
      logger.info('Email server connection established successfully');
    })
    .catch((error: any) => {
      logger.warn('Email server connection failed, email functionality disabled:', error.message);
      transporter = null;
    });
} else {
  logger.warn('Email configuration incomplete, email functionality disabled');
}

export default transporter;