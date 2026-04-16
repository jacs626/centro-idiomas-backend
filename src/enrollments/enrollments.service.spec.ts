import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto/create-enrollment.dto';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let prisma: { enrollment: any };

  beforeEach(async () => {
    const enrollments: any[] = [];

    prisma = {
      enrollment: {
        findMany: jest.fn().mockImplementation((args: any) => {
          if (args.where?.userId) {
            return Promise.resolve(
              enrollments.filter((e) => e.userId === args.where.userId),
            );
          }
          if (args.where?.groupId) {
            return Promise.resolve(
              enrollments.filter((e) => e.groupId === args.where.groupId),
            );
          }
          return Promise.resolve([...enrollments]);
        }),
        create: jest.fn().mockImplementation((data: any) => {
          const enrollment = { id: enrollments.length + 1, ...data };
          enrollments.push(enrollment);
          return Promise.resolve(enrollment);
        }),
        findUnique: jest.fn().mockImplementation(({ where }: any) => {
          const enrollment = enrollments.find((e) => e.id === where.id);
          return Promise.resolve(enrollment || null);
        }),
        update: jest.fn().mockImplementation((args: any) => {
          const index = enrollments.findIndex((e) => e.id === args.where.id);
          if (index !== -1) {
            enrollments[index] = { ...enrollments[index], ...args.data };
            return Promise.resolve(enrollments[index]);
          }
          return Promise.resolve(null);
        }),
        delete: jest.fn().mockImplementation(({ where }: any) => {
          const index = enrollments.findIndex((e) => e.id === where.id);
          if (index !== -1) enrollments.splice(index, 1);
          return Promise.resolve(undefined);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD Operations', () => {
    const dto: CreateEnrollmentDto = {
      userId: 1,
      groupId: 1,
    };

    describe('create', () => {
      it('should create an enrollment', async () => {
        const createdEnrollment = {
          id: 1,
          userId: 1,
          groupId: 1,
          status: 'active',
          progress: 0,
        };
        prisma.enrollment.create.mockResolvedValue(createdEnrollment);
        const result = await service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.userId).toBe(1);
        expect(result.groupId).toBe(1);
      });
    });

    describe('findAll', () => {
      it('should return all enrollments', async () => {
        prisma.enrollment.findMany.mockResolvedValue([
          { id: 1, userId: 1, groupId: 1 },
        ]);
        const enrollments = await service.findAll();
        expect(enrollments).toHaveLength(1);
      });
    });

    describe('findByUser', () => {
      it('should return enrollments by user', async () => {
        prisma.enrollment.findMany.mockResolvedValue([
          { id: 1, userId: 1, groupId: 1 },
          { id: 2, userId: 1, groupId: 2 },
        ]);
        const enrollments = await service.findByUser(1);
        expect(enrollments).toHaveLength(2);
      });

      it('should return empty array when no enrollments', async () => {
        prisma.enrollment.findMany.mockResolvedValue([]);
        const enrollments = await service.findByUser(999);
        expect(enrollments).toHaveLength(0);
      });
    });

    describe('findByGroup', () => {
      it('should return enrollments by group', async () => {
        prisma.enrollment.findMany.mockResolvedValue([
          { id: 1, userId: 1, groupId: 1 },
        ]);
        const enrollments = await service.findByGroup(1);
        expect(enrollments).toHaveLength(1);
      });
    });

    describe('findByUserAndGroup', () => {
      it('should return enrollments by user and group', async () => {
        prisma.enrollment.findMany.mockResolvedValue([
          { id: 1, userId: 1, groupId: 1 },
        ]);
        const enrollments = await service.findByUserAndGroup(1, 1);
        expect(enrollments).toHaveLength(1);
        expect(enrollments[0].userId).toBe(1);
      });

      it('should return empty array when no match', async () => {
        prisma.enrollment.findMany.mockResolvedValue([]);
        const enrollments = await service.findByUserAndGroup(999, 999);
        expect(enrollments).toHaveLength(0);
      });
    });

    describe('update', () => {
      it('should update an enrollment', async () => {
        const existingEnrollment = {
          id: 1,
          userId: 1,
          groupId: 1,
          status: 'active',
          progress: 0,
        };
        prisma.enrollment.findUnique.mockResolvedValue(existingEnrollment);
        const updatedEnrollment = {
          id: 1,
          userId: 1,
          groupId: 1,
          status: 'completed',
          progress: 0,
        };
        prisma.enrollment.update.mockResolvedValue(updatedEnrollment);
        const updated = await service.update(1, { status: 'completed' });
        expect(updated.status).toBe('completed');
      });

      it('should throw NotFoundException for non-existent enrollment', async () => {
        prisma.enrollment.findUnique.mockResolvedValue(null);
        await expect(
          service.update(999, { status: 'completed' }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove an enrollment', async () => {
        const existingEnrollment = {
          id: 1,
          userId: 1,
          groupId: 1,
          status: 'active',
          progress: 0,
        };
        prisma.enrollment.findUnique.mockResolvedValue(existingEnrollment);
        prisma.enrollment.delete.mockResolvedValue(existingEnrollment);
        const removed = await service.remove(1);
        expect(removed.id).toBe(1);
      });

      it('should throw NotFoundException for non-existent enrollment', async () => {
        prisma.enrollment.findUnique.mockResolvedValue(null);
        await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      });
    });

    describe('findById', () => {
      it('should return an enrollment by id', async () => {
        const enrollment = {
          id: 1,
          userId: 1,
          groupId: 1,
          status: 'active',
          progress: 0,
        };
        prisma.enrollment.findUnique.mockResolvedValue(enrollment);
        const result = await service.findById(1);
        expect(result).toEqual(enrollment);
      });

      it('should return null for non-existent enrollment', async () => {
        prisma.enrollment.findUnique.mockResolvedValue(null);
        const result = await service.findById(999);
        expect(result).toBeNull();
      });
    });
  });
});
