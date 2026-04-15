import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { NotFoundException } from '@nestjs/common';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  const mockEnrollment = { id: 1, userId: 1, groupId: 1, status: 'active' };

  const mockEnrollmentsService = {
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findByGroup: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        { provide: EnrollmentsService, useValue: mockEnrollmentsService },
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all enrollments', () => {
      mockEnrollmentsService.findAll.mockReturnValue([mockEnrollment]);
      expect(controller.findAll()).toEqual([mockEnrollment]);
      expect(mockEnrollmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('should return enrollments by user', () => {
      mockEnrollmentsService.findByUser.mockReturnValue([mockEnrollment]);
      expect(controller.findByUser('1')).toEqual([mockEnrollment]);
      expect(mockEnrollmentsService.findByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findByGroup', () => {
    it('should return enrollments by group', () => {
      mockEnrollmentsService.findByGroup.mockReturnValue([mockEnrollment]);
      expect(controller.findByGroup('1')).toEqual([mockEnrollment]);
      expect(mockEnrollmentsService.findByGroup).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create an enrollment', () => {
      const dto = { userId: 1, groupId: 1, status: 'active' };
      mockEnrollmentsService.create.mockReturnValue(mockEnrollment);
      expect(controller.create(dto)).toEqual(mockEnrollment);
      expect(mockEnrollmentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an enrollment', () => {
      const dto = { status: 'completed' };
      mockEnrollmentsService.update.mockReturnValue({ ...mockEnrollment, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockEnrollment, ...dto });
      expect(mockEnrollmentsService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when not found', async () => {
      mockEnrollmentsService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an enrollment', () => {
      mockEnrollmentsService.remove.mockReturnValue(mockEnrollment);
      expect(controller.remove('1')).toEqual(mockEnrollment);
      expect(mockEnrollmentsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when not found', async () => {
      mockEnrollmentsService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});