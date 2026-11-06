import { UserRepository } from '@/repositories/user-repository';
import { PasswordResetService } from '@/services/password-reset-service';
import { EmailService } from '@/services/email-service';

export class ForgotPasswordService {
  private readonly userRepository = new UserRepository();
  private readonly passwordResetService = new PasswordResetService();
  private readonly emailService = new EmailService();

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    const token = await this.passwordResetService.createToken(user.id);

    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      throw new Error('APP_URL is not configured.');
    }

    const resetUrl = new URL('/account/reset-password', appUrl);
    resetUrl.searchParams.set('token', token);

    await this.emailService.sendPasswordResetEmail(user.email, resetUrl.toString());
  }
}
