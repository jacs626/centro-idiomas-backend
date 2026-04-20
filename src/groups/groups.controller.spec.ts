import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { NotFoundException } from '@nestjs/common';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  const mockGroup = {
    id: 1,
    name: 'Group A',
    courseId: 1,
    teacherId: 1,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-01'),
    course: {
      id: 1,
      name: 'English',
      level: 'A1',
      description: 'English course',
    },
    teacher: {
      id: 1,
      name: 'Teacher',
      email: 'teacher@example.com',
      role: 'profesor',
    },
  };

  const mockGroupsService = {
    findAll: jest.fn(),
    findByCourseWithAccess: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findTeachers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [{ provide: GroupsService, useValue: mockGroupsService }],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      mockGroupsService.findAll.mockResolvedValue([mockGroup]);
      const req = { user: { sub: 1, role: 'admin' } } as any;
      expect(await controller.findAll(req)).toEqual([mockGroup]);
      expect(mockGroupsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCourse', () => {
    it('should return groups by course', async () => {
      mockGroupsService.findByCourseWithAccess.mockResolvedValue([mockGroup]);
      const req = { user: { sub: 1, role: 'admin' } } as any;
      expect(await controller.findByCourse('1', req)).toEqual([mockGroup]);
      expect(mockGroupsService.findByCourseWithAccess).toHaveBeenCalledWith(
        1,
        req.user,
      );
    });
  });

  describe('create', () => {
    it('should create a group', async () => {
      const dto = {
        name: 'Group B',
        courseId: 2,
        teacherId: 1,
        startDate: '2024-01-01',
        endDate: '2024-06-01',
      };
      mockGroupsService.create.mockResolvedValue({ id: 2, ...dto });
      expect(await controller.create(dto)).toEqual({ id: 2, ...dto });
      expect(mockGroupsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const dto = { name: 'Updated Group' };
      mockGroupsService.update.mockResolvedValue({ ...mockGroup, ...dto });
      expect(await controller.update('1', dto)).toEqual({
        ...mockGroup,
        ...dto,
      });
      expect(mockGroupsService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when group not found', async () => {
      mockGroupsService.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a group', async () => {
      mockGroupsService.remove.mockResolvedValue(mockGroup);
      expect(await controller.remove('1')).toEqual(mockGroup);
      expect(mockGroupsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when group not found', async () => {
      mockGroupsService.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
