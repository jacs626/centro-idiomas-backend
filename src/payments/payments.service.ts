import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto/update-payment.dto';

type Payment = {
  id: number;
  userId: number;
  groupId: number;
  amount: number;
  type: 'matricula' | 'cuota';
  status: 'pending' | 'paid' | 'late';
  dueDate: string;
  paidAt?: string;
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
      ...dto,
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

  findByUser(userId: number) {
    return this.payments.filter((p) => p.userId === userId);
  }

  findByGroup(groupId: number) {
    return this.payments.filter((p) => p.groupId === groupId);
  }

  findByStatus(status: 'pending' | 'paid' | 'late') {
    return this.payments.filter((p) => p.status === status);
  }
}