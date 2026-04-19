import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { NotFoundException } from '@nestjs/common';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCourse = {
    id: 1,
    name: 'English',
    level: 'A1',
    description: 'English course',
  };

  const mockCoursesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: mockCoursesService }],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      mockCoursesService.findAll.mockResolvedValue([mockCourse]);
      const req = { user: { sub: 1, role: 'admin' } } as any;
      expect(await controller.findAll(req)).toEqual([mockCourse]);
      expect(mockCoursesService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a course', async () => {
      const dto = {
        name: 'English',
        level: 'A1',
        description: 'English course',
      };
      mockCoursesService.create.mockResolvedValue(mockCourse);
      expect(await controller.create(dto)).toEqual(mockCourse);
      expect(mockCoursesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const dto = { name: 'Spanish' };
      mockCoursesService.update.mockResolvedValue({ ...mockCourse, ...dto });
      expect(await controller.update('1', dto)).toEqual({
        ...mockCourse,
        ...dto,
      });
      expect(mockCoursesService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when course not found', async () => {
      mockCoursesService.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      mockCoursesService.remove.mockResolvedValue(mockCourse);
      expect(await controller.remove('1')).toEqual(mockCourse);
      expect(mockCoursesService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when course not found', async () => {
      mockCoursesService.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
