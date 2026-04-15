import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { NotFoundException } from '@nestjs/common';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  const mockGroup = { id: 1, name: 'Group A', courseId: 1 };

  const mockGroupsService = {
    findAll: jest.fn(),
    findByCourse: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        { provide: GroupsService, useValue: mockGroupsService },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all groups', () => {
      mockGroupsService.findAll.mockReturnValue([mockGroup]);
      expect(controller.findAll()).toEqual([mockGroup]);
      expect(mockGroupsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCourse', () => {
    it('should return groups by course', () => {
      mockGroupsService.findByCourse.mockReturnValue([mockGroup]);
      expect(controller.findByCourse('1')).toEqual([mockGroup]);
      expect(mockGroupsService.findByCourse).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a group', () => {
      const dto = { name: 'Group B', courseId: 2 };
      mockGroupsService.create.mockReturnValue({ id: 2, ...dto });
      expect(controller.create(dto)).toEqual({ id: 2, ...dto });
      expect(mockGroupsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a group', () => {
      const dto = { name: 'Updated Group' };
      mockGroupsService.update.mockReturnValue({ ...mockGroup, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockGroup, ...dto });
      expect(mockGroupsService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when group not found', async () => {
      mockGroupsService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a group', () => {
      mockGroupsService.remove.mockReturnValue(mockGroup);
      expect(controller.remove('1')).toEqual(mockGroup);
      expect(mockGroupsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when group not found', async () => {
      mockGroupsService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});