import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';

describe('CertificatesController', () => {
  let controller: CertificatesController;
  let service: CertificatesService;

  const mockCertificate: CreateCertificateDto & { id: number; issuedAt: Date } =
    {
      id: 1,
      enrollmentId: 1,
      fileUrl: '/certificates/1.pdf',
      issuedAt: new Date(),
    };

  const mockCertificatesService = {
    findAll: jest.fn(),
    findByEnrollment: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificatesController],
      providers: [
        { provide: CertificatesService, useValue: mockCertificatesService },
      ],
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

  describe('findByEnrollment', () => {
    it('should return certificates by enrollment', () => {
      mockCertificatesService.findByEnrollment.mockReturnValue([
        mockCertificate,
      ]);
      expect(controller.findByEnrollment('1')).toEqual([mockCertificate]);
      expect(mockCertificatesService.findByEnrollment).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a certificate', () => {
      const dto: CreateCertificateDto = {
        enrollmentId: 1,
        fileUrl: '/certificates/1.pdf',
      };
      mockCertificatesService.create.mockReturnValue(mockCertificate);
      expect(controller.create(dto)).toEqual(mockCertificate);
    });
  });

  describe('update', () => {
    it('should update a certificate', () => {
      const dto = { fileUrl: '/new/path.pdf' };
      mockCertificatesService.update.mockReturnValue({
        ...mockCertificate,
        ...dto,
      });
      expect(controller.update('1', dto)).toEqual({
        ...mockCertificate,
        ...dto,
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockCertificatesService.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.update('999', { fileUrl: '/new.pdf' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a certificate', () => {
      mockCertificatesService.remove.mockReturnValue(mockCertificate);
      expect(controller.remove('1')).toEqual(mockCertificate);
    });

    it('should throw NotFoundException when not found', async () => {
      mockCertificatesService.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
