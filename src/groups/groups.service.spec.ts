import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let prisma: {
    group: {
      findMany: jest.Mock;
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const groups: Array<{
      id: number;
      name: string;
      courseId: number;
      teacherId: number;
      startDate: string;
      endDate: string;
    }> = [];
    let idCounter = 1;

    prisma = {
      group: {
        findMany: jest
          .fn()
          .mockImplementation(() => Promise.resolve([...groups])),
        create: jest.fn().mockImplementation((data) => {
          const group = { id: idCounter++, ...data };
          groups.push(group);
          return Promise.resolve({ ...group, course: {}, teacher: {} });
        }),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const group = groups.find((g) => g.id === where.id);
          return Promise.resolve(group || null);
        }),
        update: jest.fn().mockImplementation((args) => {
          const index = groups.findIndex((g) => g.id === args.where.id);
          if (index !== -1) {
            groups[index] = { ...groups[index], ...args.data };
            return Promise.resolve({
              ...groups[index],
              course: {},
              teacher: {},
            });
          }
          return Promise.resolve(null);
        }),
        delete: jest.fn().mockImplementation(({ where }) => {
          const index = groups.findIndex((g) => g.id === where.id);
          if (index !== -1) {
            groups.splice(index, 1);
          }
          return Promise.resolve(undefined);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD Operations', () => {
    const dto = {
      name: 'Group A',
      courseId: 1,
      teacherId: 1,
      startDate: '2024-01-01',
      endDate: '2024-06-01',
    };

    describe('create', () => {
      it('should create a group', async () => {
        const createdGroup = {
          id: 1,
          name: 'Group A',
          courseId: 1,
          teacherId: 1,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-01'),
          course: {},
          teacher: {},
        };
        prisma.group.create.mockResolvedValue(createdGroup);
        const result = await service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.name).toBe('Group A');
        expect(result.courseId).toBe(1);
        expect(prisma.group.create).toHaveBeenCalledWith({
          data: {
            name: 'Group A',
            courseId: 1,
            teacherId: 1,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-06-01'),
          },
          include: { course: true, teacher: true },
        });
      });
    });

    describe('findAll', () => {
      it('should return all groups', async () => {
        prisma.group.findMany.mockResolvedValue([
          { id: 1, name: 'Group A', courseId: 1, course: {}, teacher: {} },
        ]);
        const groups = await service.findAll();
        expect(groups).toHaveLength(1);
        expect(groups[0].name).toBe('Group A');
        expect(prisma.group.findMany).toHaveBeenCalledWith({
          include: { course: true, teacher: true },
        });
      });
    });

    describe('findByCourse', () => {
      it('should return groups by course', async () => {
        prisma.group.findMany.mockResolvedValue([
          { id: 1, name: 'Group A', courseId: 1, course: {}, teacher: {} },
          { id: 2, name: 'Group B', courseId: 1, course: {}, teacher: {} },
        ]);
        const groups = await service.findByCourse(1);
        expect(groups).toHaveLength(2);
        expect(prisma.group.findMany).toHaveBeenCalledWith({
          where: { courseId: 1 },
          include: { course: true, teacher: true },
        });
      });

      it('should return empty array when no groups found', async () => {
        prisma.group.findMany.mockResolvedValue([]);
        const groups = await service.findByCourse(999);
        expect(groups).toHaveLength(0);
      });
    });

    describe('update', () => {
      it('should update a group', async () => {
        const existingGroup = {
          id: 1,
          name: 'Group A',
          courseId: 1,
          teacherId: 1,
          startDate: '2024-01-01',
          endDate: '2024-06-01',
        };
        prisma.group.findUnique.mockResolvedValue(existingGroup);
        const updatedGroup = {
          id: 1,
          name: 'Updated Group',
          courseId: 1,
          teacherId: 1,
          startDate: '2024-01-01',
          endDate: '2024-06-01',
          course: {},
          teacher: {},
        };
        prisma.group.update.mockResolvedValue(updatedGroup);
        const updated = await service.update(1, { name: 'Updated Group' });
        expect(updated.name).toBe('Updated Group');
        expect(prisma.group.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: { name: 'Updated Group' },
          include: { course: true, teacher: true },
        });
      });

      it('should throw NotFoundException for non-existent group', async () => {
        prisma.group.findUnique.mockResolvedValue(null);
        await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('remove', () => {
      it('should remove a group', async () => {
        const existingGroup = {
          id: 1,
          name: 'Group A',
          courseId: 1,
          teacherId: 1,
          startDate: '2024-01-01',
          endDate: '2024-06-01',
        };
        prisma.group.findUnique.mockResolvedValue(existingGroup);
        prisma.group.delete.mockResolvedValue(existingGroup);
        const removed = await service.remove(1);
        expect(removed.id).toBe(1);
        expect(prisma.group.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      });

      it('should throw NotFoundException for non-existent group', async () => {
        prisma.group.findUnique.mockResolvedValue(null);
        await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
