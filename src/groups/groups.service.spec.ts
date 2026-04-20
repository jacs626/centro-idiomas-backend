import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('GroupsService', () => {
  let service: GroupsService;
  let prisma: PrismaService;

  const mockPrisma = {
    group: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all groups for admin', async () => {
      const mockGroups = [
        {
          id: 1,
          name: 'Group A',
          courseId: 1,
          teacherId: 1,
          course: {},
          teacher: {},
        },
        {
          id: 2,
          name: 'Group B',
          courseId: 1,
          teacherId: 2,
          course: {},
          teacher: {},
        },
      ];
      mockPrisma.group.findMany.mockResolvedValue(mockGroups);

      const groups = await service.findAll({ sub: 1, role: 'admin' });

      expect(groups).toHaveLength(2);
      expect(mockPrisma.group.findMany).toHaveBeenCalled();
    });

    it('should filter groups by teacher for profesor', async () => {
      mockPrisma.group.findMany.mockResolvedValue([
        { id: 1, name: 'Group A', teacherId: 1, course: {}, teacher: {} },
      ]);

      await service.findAll({ sub: 1, role: 'profesor' });

      expect(mockPrisma.group.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a group by id', async () => {
      const mockGroup = { id: 1, name: 'Group A', courseId: 1, teacherId: 1 };
      mockPrisma.group.findUnique.mockResolvedValue(mockGroup);

      const group = await service.findOne(1);

      expect(group.name).toBe('Group A');
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.group.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCourse', () => {
    it('should return groups by course', async () => {
      const mockGroups = [
        { id: 1, name: 'Group A', courseId: 1, course: {}, teacher: {} },
        { id: 2, name: 'Group B', courseId: 1, course: {}, teacher: {} },
      ];
      mockPrisma.group.findMany.mockResolvedValue(mockGroups);

      const groups = await service.findByCourse(1);

      expect(groups).toHaveLength(2);
      expect(mockPrisma.group.findMany).toHaveBeenCalledWith({
        where: { courseId: 1 },
        include: { course: true, teacher: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new group', async () => {
      const dto = {
        name: 'Group A',
        courseId: 1,
        teacherId: 1,
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        schedule: 'Mon 10:00',
      };
      const createdGroup = {
        id: 1,
        name: 'Group A',
        courseId: 1,
        teacherId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-01'),
        schedule: 'Mon 10:00',
        course: {},
        teacher: {},
      };
      mockPrisma.group.create.mockResolvedValue(createdGroup);

      const result = await service.create(dto);

      expect(result).toEqual(expect.objectContaining({ name: 'Group A' }));
      expect(mockPrisma.group.create).toHaveBeenCalledWith({
        data: {
          name: 'Group A',
          courseId: 1,
          teacherId: 1,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-01'),
          schedule: 'Mon 10:00',
        },
        include: { course: true, teacher: true },
      });
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const mockGroup = { id: 1, name: 'Group A' };
      mockPrisma.group.findUnique.mockResolvedValue(mockGroup);
      mockPrisma.group.update.mockResolvedValue({
        ...mockGroup,
        name: 'Updated Group',
      });

      const result = await service.update(1, { name: 'Updated Group' });

      expect(result.name).toBe('Updated Group');
    });

    it('should throw NotFoundException for non-existent group', async () => {
      mockPrisma.group.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      const mockGroup = { id: 1, name: 'Group A' };
      mockPrisma.group.findUnique.mockResolvedValue(mockGroup);
      mockPrisma.group.delete.mockResolvedValue(mockGroup);

      const result = await service.remove(1);

      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException for non-existent group', async () => {
      mockPrisma.group.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
