import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: http://localhost:3001/reset-password?token=${token}`,
      });
    } catch (error) {
      return { message: 'Ha ocurrido un error' };
    }
  }
}
