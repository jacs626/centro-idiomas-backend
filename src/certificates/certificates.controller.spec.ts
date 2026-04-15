import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { NotFoundException } from '@nestjs/common';

describe('CertificatesController', () => {
  let controller: CertificatesController;
  let service: CertificatesService;

  const mockCertificate = { id: 1, userId: 1, courseId: 1, issuedAt: new Date() };

  const mockCertificatesService = {
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findByCourse: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificatesController],
      providers: [{ provide: CertificatesService, useValue: mockCertificatesService }],
    }).compile();

    controller = module.get<CertificatesController>(CertificatesController);
    service = module.get<CertificatesService>(CertificatesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all certificates', () => {
      mockCertificatesService.findAll.mockReturnValue([mockCertificate]);
      expect(controller.findAll()).toEqual([mockCertificate]);
    });
  });

  describe('findByUser', () => {
    it('should return certificates by user', () => {
      mockCertificatesService.findByUser.mockReturnValue([mockCertificate]);
      expect(controller.findByUser('1')).toEqual([mockCertificate]);
    });
  });

  describe('findByCourse', () => {
    it('should return certificates by course', () => {
      mockCertificatesService.findByCourse.mockReturnValue([mockCertificate]);
      expect(controller.findByCourse('1')).toEqual([mockCertificate]);
    });
  });

  describe('create', () => {
    it('should create a certificate', () => {
      const dto = { userId: 1, courseId: 1 };
      mockCertificatesService.create.mockReturnValue(mockCertificate);
      expect(controller.create(dto)).toEqual(mockCertificate);
    });
  });

  describe('update', () => {
    it('should update a certificate', () => {
      const dto = { userId: 2 };
      mockCertificatesService.update.mockReturnValue({ ...mockCertificate, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockCertificate, ...dto });
    });

    it('should throw NotFoundException when not found', async () => {
      mockCertificatesService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a certificate', () => {
      mockCertificatesService.remove.mockReturnValue(mockCertificate);
      expect(controller.remove('1')).toEqual(mockCertificate);
    });

    it('should throw NotFoundException when not found', async () => {
      mockCertificatesService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});