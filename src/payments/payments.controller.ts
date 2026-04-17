import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('admin', 'profesor')
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id/pay')
  @Roles('admin', 'profesor')
  markAsPaid(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.markAsPaid(id);
  }

  @Get('by-user')
  getByUser(@Query('userId') userId: string) {
    return this.paymentsService.findByUser(Number(userId));
  }

  @Get('enrollment/:id')
  @Roles('admin', 'profesor')
  findByEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findByEnrollment(id);
  }

  @Get('by-enrollment/:enrollmentId')
  @Roles('admin', 'profesor')
  findByEnrollmentAlt(@Param('enrollmentId', ParseIntPipe) enrollmentId: number) {
    return this.paymentsService.findByEnrollment(enrollmentId);
  }

  @Get('group/:id')
  @Roles('admin', 'profesor')
  findByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findByGroup(id);
  }
}
