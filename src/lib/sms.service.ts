import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendSms(to: string, message: string) {
    const url = 'https://www.dreams.sa/index.php/api/sendsms/';

    return axios.get(url, {
      params: {
        user: 'imedevent',
        secret_key: process.env.SMS_SECRET,
        to,
        message,
        sender: 'iMEDEVENT',
      },
    });
  }
}
