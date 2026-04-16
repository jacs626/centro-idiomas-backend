import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('by-enrollment')
  findByEnrollment(@Query('enrollmentId') enrollmentId: string) {
    return this.paymentsService.findByEnrollment(Number(enrollmentId));
  }

  @Get('by-status')
  findByStatus(@Query('status') status: string) {
    return this.paymentsService.findByStatus(
      status as 'pending' | 'paid' | 'late',
    );
  }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(Number(id));
  }
}
