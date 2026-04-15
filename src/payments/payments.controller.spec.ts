import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPayment = { id: 1, userId: 1, groupId: 1, amount: 100, type: 'matricula' as const, status: 'pending' as const, dueDate: '2024-01-01' };

  const mockPaymentsService = {
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findByGroup: jest.fn(),
    findByStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  describe('findAll', () => {
    it('should return all payments', () => {
      mockPaymentsService.findAll.mockReturnValue([mockPayment]);
      expect(controller.findAll()).toEqual([mockPayment]);
    });
  });

  describe('findByUser', () => {
    it('should return payments by user', () => {
      mockPaymentsService.findByUser.mockReturnValue([mockPayment]);
      expect(controller.findByUser('1')).toEqual([mockPayment]);
    });
  });

  describe('findByGroup', () => {
    it('should return payments by group', () => {
      mockPaymentsService.findByGroup.mockReturnValue([mockPayment]);
      expect(controller.findByGroup('1')).toEqual([mockPayment]);
    });
  });

  describe('findByStatus', () => {
    it('should return payments by status', () => {
      mockPaymentsService.findByStatus.mockReturnValue([mockPayment]);
      expect(controller.findByStatus('pending')).toEqual([mockPayment]);
    });
  });

  describe('create', () => {
    it('should create a payment', () => {
      const dto = { userId: 1, groupId: 1, amount: 100, type: 'matricula' as const, status: 'pending' as const, dueDate: '2024-01-01' };
      mockPaymentsService.create.mockReturnValue(mockPayment);
      expect(controller.create(dto)).toEqual(mockPayment);
    });
  });

  describe('update', () => {
    it('should update a payment', () => {
      const dto = { status: 'paid' as const };
      mockPaymentsService.update.mockReturnValue({ ...mockPayment, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockPayment, ...dto });
    });

    it('should throw NotFoundException when not found', async () => {
      mockPaymentsService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a payment', () => {
      mockPaymentsService.remove.mockReturnValue(mockPayment);
      expect(controller.remove('1')).toEqual(mockPayment);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPaymentsService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});