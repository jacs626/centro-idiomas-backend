import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: {
    course: {
      findMany: jest.Mock;
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const courses: Array<{
      id: number;
      name: string;
      level: string;
      description: string;
    }> = [];
    let idCounter = 1;

    prisma = {
      course: {
        findMany: jest
          .fn()
          .mockImplementation(() => Promise.resolve([...courses])),
        create: jest.fn().mockImplementation((data) => {
          const course = { id: idCounter++, ...data };
          courses.push(course);
          return Promise.resolve(course);
        }),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const course = courses.find((c) => c.id === where.id);
          return Promise.resolve(course || null);
        }),
        update: jest.fn().mockImplementation((args) => {
          const index = courses.findIndex((c) => c.id === args.where.id);
          if (index !== -1) {
            courses[index] = { ...courses[index], ...args.data };
            return Promise.resolve(courses[index]);
          }
          return Promise.resolve(null);
        }),
        delete: jest.fn().mockImplementation(({ where }) => {
          const index = courses.findIndex((c) => c.id === where.id);
          if (index !== -1) {
            courses.splice(index, 1);
          }
          return Promise.resolve(undefined);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD Operations', () => {
    const dto = { name: 'English', level: 'A1', description: 'English course' };

    describe('create', () => {
      it('should create a course', async () => {
        const createdCourse = {
          id: 1,
          name: 'English',
          level: 'A1',
          description: 'English course',
        };
        prisma.course.create.mockResolvedValue(createdCourse);
        const result = await service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.name).toBe('English');
        expect(result.description).toBe('English course');
        expect(prisma.course.create).toHaveBeenCalledWith({ data: dto });
      });
    });

    describe('findAll', () => {
      it('should return all courses', async () => {
        prisma.course.findMany.mockResolvedValue([
          { id: 1, name: 'English', description: 'English course' },
        ]);
        const courses = await service.findAll();
        expect(courses).toHaveLength(1);
        expect(courses[0].name).toBe('English');
        expect(prisma.course.findMany).toHaveBeenCalled();
      });
    });

    describe('update', () => {
      it('should update a course', async () => {
        const existingCourse = {
          id: 1,
          name: 'English',
          level: 'A1',
          description: 'English course',
        };
        prisma.course.findUnique.mockResolvedValue(existingCourse);
        const updatedCourse = {
          id: 1,
          name: 'Spanish',
          level: 'A1',
          description: 'English course',
        };
        prisma.course.update.mockResolvedValue(updatedCourse);
        const updated = await service.update(1, { name: 'Spanish' });
        expect(updated.name).toBe('Spanish');
        expect(prisma.course.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: { name: 'Spanish' },
        });
      });

      it('should throw NotFoundException for non-existent course', async () => {
        prisma.course.findUnique.mockResolvedValue(null);
        await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('remove', () => {
      it('should remove a course', async () => {
        prisma.course.findUnique.mockResolvedValue({
          id: 1,
          name: 'English',
          description: 'English course',
        });
        const removed = await service.remove(1);
        expect(removed.id).toBe(1);
        expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      });

      it('should throw NotFoundException for non-existent course', async () => {
        prisma.course.findUnique.mockResolvedValue(null);
        await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
