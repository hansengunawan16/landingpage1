import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(@Body('orderId') orderId: string) {
    return this.paymentsService.initiatePayment(orderId);
  }

  @Post('webhook')
  @HttpCode(200)
  webhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
