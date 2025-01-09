import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Get('send-test')
  async sendTestSms(
    @Query('phone') phone: string,
    @Query('message') message: string,
  ): Promise<string> {
    if (!phone) {
      throw new BadRequestException('Le numéro de téléphone (phone) est requis.');
    }

    const smsMessage = message || 'Ceci est un test SMS via Free Mobile API.';
    await this.smsService.sendSms(phone, smsMessage); // Passer `phone` et `smsMessage`
    return 'SMS envoyé avec succès.';
  }
}
