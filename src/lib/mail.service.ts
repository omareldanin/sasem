import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'mail5019.site4now.net',
    port: 465,
    secure: true,
    auth: {
      user: 'followup@imedeventapp.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: 'followup@imedeventapp.com',
      to,
      subject,
      html,
    });
  }
}
