import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto/update-certificate.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';

type Certificate = {
  id: number;
  enrollmentId: number;
  issuedAt: string;
  fileUrl: string;
};

@Injectable()
export class CertificatesService {
  private certificates: Certificate[] = [];

  constructor(private enrollmentService: EnrollmentsService) {}

  findAll() {
    return this.certificates;
  }

  async create(dto: CreateCertificateDto) {
    const enrollment = await this.enrollmentService.findById(dto.enrollmentId);
    if (!enrollment || enrollment.progress < 80) {
      throw new NotFoundException('Enrollment not found or progress below 80%');
    }

    const existingCert = this.certificates.find(
      (c) => c.enrollmentId === dto.enrollmentId,
    );
    if (existingCert) {
      throw new NotFoundException(
        'Certificate already exists for this enrollment',
      );
    }

    const id = Date.now();
    const pdfUrl = `/certificates/${id}.pdf`;

    const certificate: Certificate = {
      id,
      enrollmentId: dto.enrollmentId,
      issuedAt: new Date().toISOString(),
      fileUrl: pdfUrl,
    };

    this.certificates.push(certificate);
    return certificate;
  }

  update(id: number, dto: UpdateCertificateDto) {
    const index = this.certificates.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Certificate with id ${id} not found`);
    }
    this.certificates[index] = { ...this.certificates[index], ...dto };
    return this.certificates[index];
  }

  remove(id: number) {
    const index = this.certificates.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Certificate with id ${id} not found`);
    }
    return this.certificates.splice(index, 1)[0];
  }

  findByEnrollment(enrollmentId: number) {
    return this.certificates.filter((c) => c.enrollmentId === enrollmentId);
  }
}
