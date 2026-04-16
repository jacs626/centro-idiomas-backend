import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { NotFoundException } from '@nestjs/common';

describe('CertificatesService', () => {
  let service: CertificatesService;

  const mockEnrollmentsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        { provide: EnrollmentsService, useValue: mockEnrollmentsService },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a certificate when enrollment has >=80% progress', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 80,
      });
      const dto = { enrollmentId: 1, fileUrl: '/certificates/1.pdf' };
      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.enrollmentId).toBe(dto.enrollmentId);
    });

    it('should throw NotFoundException when enrollment not found', async () => {
      mockEnrollmentsService.findById.mockResolvedValue(null);
      const dto = { enrollmentId: 999, fileUrl: '/certificates/1.pdf' };
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when progress below 80%', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 50,
      });
      const dto = { enrollmentId: 1, fileUrl: '/certificates/1.pdf' };
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when certificate already exists', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 80,
      });
      const dto = { enrollmentId: 1, fileUrl: '/certificates/1.pdf' };
      await service.create(dto);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all certificates', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 80,
      });
      await service.create({ enrollmentId: 1, fileUrl: '/certificates/1.pdf' });
      const certificates = service.findAll();
      expect(certificates).toHaveLength(1);
    });
  });

  describe('findByEnrollment', () => {
    it('should return certificates by enrollment', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 80,
      });
      await service.create({ enrollmentId: 1, fileUrl: '/certificates/1.pdf' });
      const certificates = service.findByEnrollment(1);
      expect(certificates).toHaveLength(1);
    });

    it('should return empty array when no certificates', () => {
      const certificates = service.findByEnrollment(999);
      expect(certificates).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update a certificate', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 80,
      });
      const created = await service.create({
        enrollmentId: 1,
        fileUrl: '/certificates/1.pdf',
      });
      const updated = service.update(created.id, { fileUrl: '/new/url.pdf' });
      expect(updated.fileUrl).toBe('/new/url.pdf');
    });

    it('should throw NotFoundException for non-existent', () => {
      expect(() => service.update(999, { fileUrl: '/new.pdf' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a certificate', async () => {
      mockEnrollmentsService.findById.mockResolvedValue({
        id: 1,
        progress: 80,
      });
      const created = await service.create({
        enrollmentId: 1,
        fileUrl: '/certificates/1.pdf',
      });
      const removed = service.remove(created.id);
      expect(removed.id).toBe(created.id);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException for non-existent', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
