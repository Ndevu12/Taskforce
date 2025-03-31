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

const smtpConfig: SMTPTransport.Options = {
  host: EMAIL_HOST || undefined,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER || '',
    pass: EMAIL_PASSWORD || ''
  },
  tls: {
    rejectUnauthorized: false
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

// Verify connection configuration
transporter.verify()
  .then(() => {
    logger.info('Email server connection established successfully');
  })
  .catch((error: any) => {
    logger.error('Error connecting to email server:', error);
  });

export default transporter;