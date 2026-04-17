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
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: number; role: string; email: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id/pay')
  @Roles('admin')
  markAsPaid(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.markAsPaid(id);
  }

  @Get('by-user')
  @Roles('admin')
  getByUser(@Query('userId') userId: string) {
    return this.paymentsService.findByUser(Number(userId));
  }

  @Get('my-payments')
  @Roles('alumno')
  getMyPayments(@Req() req: RequestWithUser) {
    return this.paymentsService.findByUser(req.user.sub);
  }

  @Get('enrollment/:id')
  @Roles('admin', 'profesor')
  findByEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findByEnrollment(id);
  }

  @Get('by-enrollment/:enrollmentId')
  @Roles('admin', 'profesor')
  findByEnrollmentAlt(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
  ) {
    return this.paymentsService.findByEnrollment(enrollmentId);
  }

  @Get('group/:id')
  @Roles('admin', 'profesor')
  findByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findByGroup(id);
  }

  @Get()
  @Roles('admin')
  findAll(
    @Query('groupId') groupId?: string,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll({
      groupId: groupId ? Number(groupId) : undefined,
      status,
    });
  }
}
