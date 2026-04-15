import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { NotFoundException } from '@nestjs/common';
import { LanguageLevel } from './enums/language-level.enum';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressService],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
  });

  describe('CRUD Operations', () => {
    const dto = { userId: 1, courseId: 1, level: LanguageLevel.A1, percentage: 50 };

    describe('create', () => {
      it('should create a progress', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.userId).toBe(dto.userId);
        expect(result.level).toBe(dto.level);
      });
    });

    describe('findAll', () => {
      it('should return all progresses', () => {
        service.create(dto);
        const progresses = service.findAll();
        expect(progresses).toHaveLength(1);
      });
    });

    describe('findByUser', () => {
      it('should return progresses by user', () => {
        service.create(dto);
        service.create({ userId: 1, courseId: 2, level: LanguageLevel.A2, percentage: 60 });
        const progresses = service.findByUser(1);
        expect(progresses).toHaveLength(2);
      });
    });

    describe('findByCourse', () => {
      it('should return progresses by course', () => {
        service.create(dto);
        const progresses = service.findByCourse(1);
        expect(progresses).toHaveLength(1);
      });
    });

    describe('update', () => {
      it('should update a progress', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { percentage: 75 });
        expect(updated.percentage).toBe(75);
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.update(999, { percentage: 75 })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a progress', () => {
        const created = service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });
  });
});