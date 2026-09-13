import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter;

function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) return null;
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  };
}

function getTransporter() {
  const options = smtpConfig();
  if (!options) return null;
  if (!transporter) transporter = nodemailer.createTransport(options);
  return transporter;
}

export function isEmailConfigured() {
  return Boolean(getTransporter() && process.env.SMTP_FROM);
}

export async function sendEmail({ to, subject, text, html }) {
  const transport = getTransporter();
  if (!transport || !process.env.SMTP_FROM) {
    return { sent: false, reason: 'SMTP is not configured.' };
  }
  const info = await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
  return { sent: true, messageId: info.messageId };
}

export function sendPasswordResetEmail({ to, actionLink }) {
  return sendEmail({
    to,
    subject: 'Reset your Amba Enterprises password',
    text: `Reset your password using this link: ${actionLink}`,
    html: `<p>Reset your Amba Enterprises password by clicking <a href="${actionLink}">this link</a>.</p>`,
  });
}

export function sendConfirmationEmail({ to, actionLink }) {
  return sendEmail({
    to,
    subject: 'Confirm your Amba Enterprises account',
    text: `Confirm your account using this link: ${actionLink}`,
    html: `<p>Welcome to Amba Enterprises. Confirm your account by clicking <a href="${actionLink}">this link</a>.</p>`,
  });
}

export function sendOrderConfirmationEmail({ to, orderNumber, totalAmount }) {
  const amount = Number(totalAmount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
  });
  return sendEmail({
    to,
    subject: `Purchase order request received - ${orderNumber}`,
    text: `We received purchase order ${orderNumber}. Total value: INR ${amount}.`,
    html: `<p>We received purchase order <strong>${orderNumber}</strong>.</p><p>Total value: INR ${amount}.</p>`,
  });
}

export const emailServiceInfo = {
  configured: isEmailConfigured,
  frontendUrl: config.frontendUrl,
};
