import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPayment = {
    id: 1,
    enrollmentId: 1,
    amount: 100,
    type: 'matricula',
    status: 'pending',
    dueDate: new Date('2024-01-01'),
    paidAt: null,
  };

  const mockPaymentsService = {
    create: jest.fn(),
    markAsPaid: jest.fn(),
    findByEnrollment: jest.fn(),
    findByGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockPaymentsService }],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto: CreatePaymentDto = {
        enrollmentId: 1,
        amount: 100,
        type: 'matricula',
        status: 'pending',
        dueDate: '2024-01-01',
      };
      mockPaymentsService.create.mockResolvedValue(mockPayment);

      const result = await controller.create(dto);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('markAsPaid', () => {
    it('should mark payment as paid', async () => {
      const paidPayment = {
        ...mockPayment,
        status: 'paid',
        paidAt: new Date(),
      };
      mockPaymentsService.markAsPaid.mockResolvedValue(paidPayment);

      const result = await controller.markAsPaid(1);

      expect(result.status).toBe('paid');
      expect(mockPaymentsService.markAsPaid).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPaymentsService.markAsPaid.mockRejectedValue(
        new NotFoundException('Payment no encontrado'),
      );

      await expect(controller.markAsPaid(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEnrollment', () => {
    it('should return payments by enrollment', async () => {
      mockPaymentsService.findByEnrollment.mockResolvedValue([mockPayment]);

      const result = await controller.findByEnrollment(1);

      expect(result).toEqual([mockPayment]);
      expect(mockPaymentsService.findByEnrollment).toHaveBeenCalledWith(1);
    });
  });

  describe('findByGroup', () => {
    it('should return payments by group', async () => {
      mockPaymentsService.findByGroup.mockResolvedValue([mockPayment]);

      const result = await controller.findByGroup(1);

      expect(result).toEqual([mockPayment]);
      expect(mockPaymentsService.findByGroup).toHaveBeenCalledWith(1);
    });
  });
});
