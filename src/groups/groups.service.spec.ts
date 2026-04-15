import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { NotFoundException } from '@nestjs/common';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  describe('CRUD Operations', () => {
    const dto = { name: 'Group A', courseId: 1 };

    describe('create', () => {
      it('should create a group', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.name).toBe(dto.name);
        expect(result.courseId).toBe(dto.courseId);
      });
    });

    describe('findAll', () => {
      it('should return all groups', () => {
        service.create(dto);
        const groups = service.findAll();
        expect(groups).toHaveLength(1);
        expect(groups[0].name).toBe('Group A');
      });
    });

    describe('findByCourse', () => {
      it('should return groups by course', () => {
        service.create(dto);
        service.create({ name: 'Group B', courseId: 1 });
        const groups = service.findByCourse(1);
        expect(groups).toHaveLength(2);
      });

      it('should return empty array when no groups found', () => {
        const groups = service.findByCourse(999);
        expect(groups).toHaveLength(0);
      });
    });

    describe('update', () => {
      it('should update a group', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { name: 'Updated Group' });
        expect(updated.name).toBe('Updated Group');
      });

      it('should throw NotFoundException for non-existent group', () => {
        expect(() => service.update(999, { name: 'Test' })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a group', () => {
        const created = service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent group', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });
  });
});