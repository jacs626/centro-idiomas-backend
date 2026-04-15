import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { NotFoundException } from '@nestjs/common';
import { LanguageLevel } from './enums/language-level.enum';

describe('ProgressController', () => {
  let controller: ProgressController;
  let service: ProgressService;

  const mockProgress = { id: 1, userId: 1, courseId: 1, level: LanguageLevel.A1, percentage: 50 };

  const mockProgressService = {
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findByCourse: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [{ provide: ProgressService, useValue: mockProgressService }],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
    service = module.get<ProgressService>(ProgressService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all progresses', () => {
      mockProgressService.findAll.mockReturnValue([mockProgress]);
      expect(controller.findAll()).toEqual([mockProgress]);
    });
  });

  describe('findByUser', () => {
    it('should return progresses by user', () => {
      mockProgressService.findByUser.mockReturnValue([mockProgress]);
      expect(controller.findByUser('1')).toEqual([mockProgress]);
    });
  });

  describe('findByCourse', () => {
    it('should return progresses by course', () => {
      mockProgressService.findByCourse.mockReturnValue([mockProgress]);
      expect(controller.findByCourse('1')).toEqual([mockProgress]);
    });
  });

  describe('create', () => {
    it('should create a progress', () => {
      const dto = { userId: 1, courseId: 1, level: LanguageLevel.A1, percentage: 50 };
      mockProgressService.create.mockReturnValue(mockProgress);
      expect(controller.create(dto)).toEqual(mockProgress);
    });
  });

  describe('update', () => {
    it('should update a progress', () => {
      const dto = { percentage: 75 };
      mockProgressService.update.mockReturnValue({ ...mockProgress, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockProgress, ...dto });
    });

    it('should throw NotFoundException when not found', async () => {
      mockProgressService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a progress', () => {
      mockProgressService.remove.mockReturnValue(mockProgress);
      expect(controller.remove('1')).toEqual(mockProgress);
    });

    it('should throw NotFoundException when not found', async () => {
      mockProgressService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});