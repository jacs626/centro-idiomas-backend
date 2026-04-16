import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('CRUD Operations', () => {
    const dto: CreatePaymentDto = {
      enrollmentId: 1,
      amount: 100,
      type: 'matricula',
      status: 'pending',
      dueDate: '2024-01-15',
    };

    describe('create', () => {
      it('should create a payment', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.enrollmentId).toBe(dto.enrollmentId);
        expect(result.amount).toBe(dto.amount);
      });
    });

    describe('findAll', () => {
      it('should return all payments', () => {
        service.create(dto);
        const payments = service.findAll();
        expect(payments).toHaveLength(1);
      });
    });

    describe('findByEnrollment', () => {
      it('should return payments by enrollment', () => {
        service.create(dto);
        service.create({
          enrollmentId: 1,
          amount: 50,
          type: 'cuota',
          status: 'pending',
          dueDate: '2024-02-01',
        });
        const payments = service.findByEnrollment(1);
        expect(payments).toHaveLength(2);
      });

      it('should return empty array when no payments', () => {
        const payments = service.findByEnrollment(999);
        expect(payments).toHaveLength(0);
      });
    });

    describe('findByStatus', () => {
      it('should return payments by status', () => {
        service.create(dto);
        const payments = service.findByStatus('pending');
        expect(payments).toHaveLength(1);
      });
    });

    describe('update', () => {
      it('should update a payment', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { status: 'paid' });
        expect(updated.status).toBe('paid');
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.update(999, { status: 'paid' })).toThrow(
          NotFoundException,
        );
      });
    });

    describe('remove', () => {
      it('should remove a payment', () => {
        const created = service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });
  });
});
