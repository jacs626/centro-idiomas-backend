import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto/update-enrollment.dto';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  const mockEnrollment = {
    id: 1,
    userId: 1,
    groupId: 1,
    progress: 0,
    status: 'active',
    user: { id: 1, name: 'John', email: 'john@example.com' },
    group: { id: 1, name: 'Group A', courseId: 1 },
  };

  const mockEnrollmentsService = {
    findAll: jest.fn(),
    findByUserFilter: jest.fn(),
    findByGroup: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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
    it('should return all enrollments', async () => {
      mockEnrollmentsService.findAll.mockResolvedValue([mockEnrollment]);
      const req = { user: { sub: 1, role: 'admin' } } as any;
      expect(await controller.findAll(req)).toEqual([mockEnrollment]);
      expect(mockEnrollmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('should return enrollments by user', async () => {
      mockEnrollmentsService.findByUserFilter.mockResolvedValue([mockEnrollment]);
      const req = { user: { sub: 1, role: 'admin' } } as any;
      expect(await controller.findByUser('1', req)).toEqual([mockEnrollment]);
      expect(mockEnrollmentsService.findByUserFilter).toHaveBeenCalledWith({ userId: 1 });
    });
  });

  describe('findByGroup', () => {
    it('should return enrollments by group', async () => {
      mockEnrollmentsService.findByGroup.mockResolvedValue([mockEnrollment]);
      const req = { user: { sub: 1, role: 'admin' } } as any;
      expect(await controller.findByGroup('1', req)).toEqual([mockEnrollment]);
      expect(mockEnrollmentsService.findByGroup).toHaveBeenCalledWith(1, req.user);
    });
  });

  describe('create', () => {
    it('should create an enrollment', async () => {
      const dto: CreateEnrollmentDto = {
        userId: 1,
        groupId: 1,
      };
      mockEnrollmentsService.create.mockResolvedValue(mockEnrollment);
      expect(await controller.create(dto)).toEqual(mockEnrollment);
      expect(mockEnrollmentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an enrollment', async () => {
      const dto: UpdateEnrollmentDto = { status: 'completed' };
      const updatedEnrollment = { ...mockEnrollment, ...dto };
      mockEnrollmentsService.update.mockResolvedValue(updatedEnrollment);
      expect(await controller.update(1, dto)).toEqual(updatedEnrollment);
      expect(mockEnrollmentsService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should update only progress field', async () => {
      const dto: UpdateEnrollmentDto = { progress: 100 };
      const updatedEnrollment = { ...mockEnrollment, progress: 100 };
      mockEnrollmentsService.update.mockResolvedValue(updatedEnrollment);
      expect(await controller.update(1, dto)).toEqual(updatedEnrollment);
    });

    it('should throw NotFoundException when not found', async () => {
      mockEnrollmentsService.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      const dto: UpdateEnrollmentDto = { status: 'completed' };
      await expect(controller.update(999, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
