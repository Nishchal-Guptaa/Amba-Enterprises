import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter = null;

/**
 * Resolves SMTP configuration options from config.
 */
function getSmtpOptions() {
  const { host, port, secure, user, password, service } = config.smtp;

  if (service && user && password) {
    return {
      service,
      auth: { user, pass: password },
    };
  }

  if (host && port && user && password) {
    return {
      host,
      port,
      secure,
      auth: { user, pass: password },
    };
  }

  return null;
}

/**
 * Returns a cached Nodemailer transporter or creates a new one.
 */
function getTransporter() {
  const options = getSmtpOptions();
  if (!options) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport(options);
  }
  return transporter;
}

/**
 * Checks whether custom email sending is configured.
 */
export function isEmailConfigured() {
  const options = getSmtpOptions();
  const from = config.smtp?.from || config.smtp?.user;
  return Boolean(options && from);
}

/**
 * Verifies the SMTP transporter connection.
 */
export async function verifyEmailConfig() {
  const transport = getTransporter();
  if (!transport) {
    return { ok: false, error: 'SMTP transporter options are missing or incomplete.' };
  }
  try {
    await transport.verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Low-level email sender.
 */
export async function sendEmail({ to, subject, text, html }) {
  const transport = getTransporter();
  const fromAddress = config.smtp.from || (config.smtp.user ? `Amba Enterprises <${config.smtp.user}>` : null);

  if (!transport || !fromAddress) {
    const error = new Error(
      'Email service is not configured. Please set SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM) in your .env file.',
    );
    error.statusCode = 503;
    error.expose = true;
    throw error;
  }

  const info = await transport.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html,
  });

  return { sent: true, messageId: info.messageId };
}

/**
 * Generates an accessible, responsive, branded HTML email for password reset.
 */
export function generatePasswordResetHtml({ resetLink, email, userName }) {
  const greeting = userName ? `Hello ${userName},` : 'Hello,';
  const currentYear = new Date().getFullYear();
  const fromAddress = config.smtp?.from || (config.smtp?.user ? `Amba Enterprises <${config.smtp.user}>` : null);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Amba Enterprises</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(11, 29, 58, 0.08); border: 1px solid #E5E7EB;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0B1D3A; padding: 32px 30px; text-align: center;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 8px; background-color: #F59E0B; color: #0B1D3A; font-weight: 800; font-size: 24px; text-align: center; margin-bottom: 10px;">
                      A
                    </div>
                    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      Amba Enterprises
                    </h1>
                    <p style="color: #F59E0B; margin: 6px 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;">
                      Industrial Piping & Valves Specialist
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              <h2 style="margin: 0 0 16px; color: #0B1D3A; font-size: 20px; font-weight: 700;">
                Password Reset Request
              </h2>
              
              <p style="margin: 0 0 14px; color: #374151; font-size: 15px; line-height: 1.6;">
                ${greeting}
              </p>

              <p style="margin: 0 0 20px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                We received a request to reset the password for your account associated with <strong style="color: #0B1D3A;">${email}</strong>.
              </p>

              <p style="margin: 0 0 24px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                Click the button below to choose a new password. This is a secure, <strong>one-time use link</strong> that will expire in 1 hour.
              </p>

              <!-- CTA Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #0B1D3A; border-radius: 8px; box-shadow: 0 4px 10px rgba(11, 29, 58, 0.2);">
                          <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 8px; letter-spacing: 0.3px;">
                            Reset My Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 24px; background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 4px; padding: 12px 14px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
                      <strong>Security Notice:</strong> If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged, and your account stays secure.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; border-top: 1px solid #E5E7EB; padding: 22px 30px; text-align: center;">
              <p style="margin: 0 0 6px; color: #6B7280; font-size: 12px;">
                Need help? Contact our support team.
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                &copy; ${currentYear} Amba Enterprises. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a clean plain text fallback for the password reset email.
 */
export function generatePasswordResetText({ resetLink, email, userName }) {
  const greeting = userName ? `Hello ${userName},` : 'Hello,';
  return `
${greeting}

We received a request to reset the password for your Amba Enterprises account associated with ${email}.

To reset your password, visit the following one-time link in your browser:
${resetLink}

This link is valid for one-time use and will expire in 1 hour.

Security Notice: If you did not request this password reset, please ignore this email. Your password will remain unchanged.

--
Amba Enterprises
Industrial Piping & Valves Specialist
`;
}

/**
 * Sends the branded password reset email.
 */
export async function sendPasswordResetEmail({ to, actionLink, resetLink, userName }) {
  const finalLink = resetLink || actionLink;
  if (!finalLink) {
    throw new Error('A reset link is required to send the password reset email.');
  }

  const html = generatePasswordResetHtml({ resetLink: finalLink, email: to, userName });
  const text = generatePasswordResetText({ resetLink: finalLink, email: to, userName });

  return sendEmail({
    to,
    subject: 'Reset your Amba Enterprises password',
    text,
    html,
  });
}

/**
 * Sends account confirmation email.
 */
export function sendConfirmationEmail({ to, actionLink }) {
  return sendEmail({
    to,
    subject: 'Confirm your Amba Enterprises account',
    text: `Confirm your account using this link: ${actionLink}`,
    html: `<p>Welcome to Amba Enterprises. Confirm your account by clicking <a href="${actionLink}">this link</a>.</p>`,
  });
}

/**
 * Sends order confirmation email.
 */
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
