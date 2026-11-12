import { getResendClient } from '@/lib/resend';

export class EmailService {
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!fromEmail) {
      throw new Error('RESEND_FROM_EMAIL is not configured.');
    }

    const resend = getResendClient();

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Reset your GymTracker password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h1>Reset your password</h1>

          <p>We received a request to reset your GymTracker password.</p>

          <p>Click the button below to choose a new password.</p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #c09721;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >
            Reset password
          </a>

          <p>This link expires in 30 minutes.</p>

          <p>If you did not request a password reset, you can safely ignore this email.</p>

          <p>GymTracker</p>
        </div>
      `,
    });

    if (error) {
      console.error('[EmailService] Failed to send password reset email:', error);

      throw new Error('Failed to send password reset email.');
    }
  }
}
