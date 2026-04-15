import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  describe('CRUD Operations', () => {
    const dto = { name: 'English', description: 'English course' };

    describe('create', () => {
      it('should create a course', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.name).toBe(dto.name);
        expect(result.description).toBe(dto.description);
      });
    });

    describe('findAll', () => {
      it('should return all courses', () => {
        service.create(dto);
        const courses = service.findAll();
        expect(courses).toHaveLength(1);
        expect(courses[0].name).toBe('English');
      });
    });

    describe('update', () => {
      it('should update a course', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { name: 'Spanish' });
        expect(updated.name).toBe('Spanish');
      });

      it('should throw NotFoundException for non-existent course', () => {
        expect(() => service.update(999, { name: 'Test' })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a course', () => {
        const created = service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent course', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });
  });
});