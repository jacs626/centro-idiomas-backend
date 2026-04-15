import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('CRUD Operations', () => {
    const dto = { userId: 1, groupId: 1, amount: 100, type: 'matricula' as const, status: 'pending' as const, dueDate: '2024-01-01' };

    describe('create', () => {
      it('should create a payment', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.userId).toBe(dto.userId);
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

    describe('findByUser', () => {
      it('should return payments by user', () => {
        service.create(dto);
        service.create({ userId: 1, groupId: 2, amount: 50, type: 'cuota' as const, status: 'pending' as const, dueDate: '2024-02-01' });
        const payments = service.findByUser(1);
        expect(payments).toHaveLength(2);
      });
    });

    describe('findByGroup', () => {
      it('should return payments by group', () => {
        service.create(dto);
        const payments = service.findByGroup(1);
        expect(payments).toHaveLength(1);
      });
    });

    describe('findByStatus', () => {
      it('should return payments by status', () => {
        service.create(dto);
        const pendingPayments = service.findByStatus('pending');
        expect(pendingPayments).toHaveLength(1);
      });
    });

    describe('update', () => {
      it('should update a payment', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { status: 'paid', paidAt: '2024-01-15' });
        expect(updated.status).toBe('paid');
        expect(updated.paidAt).toBe('2024-01-15');
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.update(999, { status: 'paid' })).toThrow(NotFoundException);
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