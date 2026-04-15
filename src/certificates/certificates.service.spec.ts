import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { ProgressService } from '../progress/progress.service';
import { NotFoundException } from '@nestjs/common';
import { LanguageLevel } from '../progress/enums/language-level.enum';

type Certificate = {
  id: number;
  userId: number;
  courseId: number;
  issuedAt: string;
  pdfUrl: string;
  approvalPercentage: number;
};

describe('CertificatesService', () => {
  let service: CertificatesService;
  let progressService: ProgressService;

  const mockProgressService = {
    findByUserAndCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        { provide: ProgressService, useValue: mockProgressService },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
    progressService = module.get<ProgressService>(ProgressService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    const dto = { userId: 1, courseId: 1 };

    describe('create', () => {
      it('should create a certificate when course is completed with pdfUrl and approvalPercentage', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 100,
        });
        const result = service.create(dto) as Certificate;
        expect(result).toHaveProperty('id');
        expect(result.userId).toBe(dto.userId);
        expect(result).toHaveProperty('issuedAt');
        expect(result).toHaveProperty('pdfUrl');
        expect(result.pdfUrl).toBe(`/certificates/${result.id}.pdf`);
        expect(result).toHaveProperty('approvalPercentage');
        expect(result.approvalPercentage).toBe(100);
      });

      it('should return message when progress not found', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue(null);
        const result = service.create(dto);
        expect(result).toEqual({ message: 'Course not completed' });
      });

      it('should return message when course not completed', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 50,
        });
        const result = service.create(dto);
        expect(result).toEqual({ message: 'Course not completed' });
      });
    });

    describe('findAll', () => {
      it('should return all certificates', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 100,
        });
        service.create(dto);
        const certificates = service.findAll();
        expect(certificates).toHaveLength(1);
      });
    });

    describe('findByUser', () => {
      it('should return certificates by user', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 100,
        });
        service.create(dto);
        service.create({ userId: 1, courseId: 2 });
        const certificates = service.findByUser(1);
        expect(certificates).toHaveLength(2);
      });
    });

    describe('findByCourse', () => {
      it('should return certificates by course', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 100,
        });
        service.create(dto);
        const certificates = service.findByCourse(1);
        expect(certificates).toHaveLength(1);
      });
    });

    describe('update', () => {
      it('should update a certificate', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 100,
        });
        const created = service.create(dto) as Certificate;
        const updated = service.update(created.id, { userId: 2 });
        expect(updated.userId).toBe(2);
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.update(999, { userId: 2 })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a certificate', () => {
        mockProgressService.findByUserAndCourse.mockReturnValue({
          userId: 1,
          courseId: 1,
          level: LanguageLevel.A1,
          percentage: 100,
        });
        const created = service.create(dto) as Certificate;
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