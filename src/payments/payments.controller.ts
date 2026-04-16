import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id/pay')
  markAsPaid(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.markAsPaid(id);
  }

  @Get('enrollment/:id')
  findByEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findByEnrollment(id);
  }

  @Get('group/:id')
  findByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findByGroup(id);
  }
}
