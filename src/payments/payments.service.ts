import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto/update-payment.dto';

type Payment = {
  id: number;
  enrollmentId: number;
  amount: number;
  type: 'matricula' | 'cuota';
  status: 'pending' | 'paid' | 'late';
  dueDate: Date | string;
  paidAt?: Date | string;
};

@Injectable()
export class PaymentsService {
  private payments: Payment[] = [];

  findAll() {
    return this.payments;
  }

  create(dto: CreatePaymentDto) {
    const newPayment: Payment = {
      id: Date.now(),
      enrollmentId: dto.enrollmentId,
      amount: dto.amount,
      type: dto.type,
      status: dto.status,
      dueDate: new Date(dto.dueDate),
      paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  update(id: number, dto: UpdatePaymentDto) {
    const index = this.payments.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    this.payments[index] = { ...this.payments[index], ...dto };
    return this.payments[index];
  }

  remove(id: number) {
    const index = this.payments.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return this.payments.splice(index, 1)[0];
  }

  findByEnrollment(enrollmentId: number) {
    return this.payments.filter((p) => p.enrollmentId === enrollmentId);
  }

  findByStatus(status: 'pending' | 'paid' | 'late') {
    return this.payments.filter((p) => p.status === status);
  }
}
