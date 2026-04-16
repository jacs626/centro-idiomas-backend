import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    payment: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto = {
        enrollmentId: 1,
        amount: 100,
        type: 'matricula' as const,
        status: 'pending' as const,
        dueDate: '2024-01-01',
      };
      const mockPayment = {
        id: 1,
        ...dto,
        dueDate: new Date('2024-01-01'),
        paidAt: null,
      };

      mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.payment.create.mockResolvedValue(mockPayment);

      const result = await service.create(dto);

      expect(result).toEqual(mockPayment);
    });

    it('should throw NotFoundException when enrollment not found', async () => {
      const dto = {
        enrollmentId: 999,
        amount: 100,
        type: 'matricula' as const,
        status: 'pending' as const,
        dueDate: '2024-01-01',
      };

      mockPrisma.enrollment.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsPaid', () => {
    it('should mark payment as paid', async () => {
      const mockPayment = {
        id: 1,
        enrollmentId: 1,
        amount: 100,
        status: 'paid',
        paidAt: new Date(),
      };

      mockPrisma.payment.update.mockResolvedValue(mockPayment);

      const result = await service.markAsPaid(1);

      expect(result.status).toBe('paid');
      expect(result.paidAt).toBeInstanceOf(Date);
    });
  });

  describe('findByEnrollment', () => {
    it('should return payments by enrollment', async () => {
      const mockPayments = [
        { id: 1, enrollmentId: 1, amount: 100, status: 'pending' },
      ];
      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await service.findByEnrollment(1);

      expect(result).toEqual(mockPayments);
    });
  });

  describe('findByGroup', () => {
    it('should return payments by group', async () => {
      const mockPayments = [
        {
          id: 1,
          enrollmentId: 1,
          amount: 100,
          status: 'pending',
          enrollment: { user: { id: 1, name: 'John' } },
        },
      ];
      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await service.findByGroup(1);

      expect(result).toEqual(mockPayments);
    });
  });

  describe('markLatePayments', () => {
    it('should mark late payments', async () => {
      mockPrisma.payment.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markLatePayments();

      expect(result.count).toBe(5);
    });
  });
});
