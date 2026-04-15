import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto/update-certificate.dto';
import { ProgressService } from '../progress/progress.service';

type Certificate = {
  id: number;
  userId: number;
  courseId: number;
  issuedAt: string;
  pdfUrl: string;
  approvalPercentage: number;
};

@Injectable()
export class CertificatesService {
  private certificates: Certificate[] = [];

  constructor(private progressService: ProgressService) {}

  findAll() {
    return this.certificates;
  }

  create(dto: CreateCertificateDto) {
    const progress = this.progressService.findByUserAndCourse(
      dto.userId,
      dto.courseId,
    );

    if (!progress || progress.percentage < 100) {
      return { message: 'Course not completed' };
    }

    const id = Date.now();
    const pdfUrl = `/certificates/${id}.pdf`;

    const certificate: Certificate = {
      id,
      userId: dto.userId,
      courseId: dto.courseId,
      issuedAt: new Date().toISOString(),
      pdfUrl,
      approvalPercentage: progress.percentage,
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

  findByUser(userId: number) {
    return this.certificates.filter((c) => c.userId === userId);
  }

  findByCourse(courseId: number) {
    return this.certificates.filter((c) => c.courseId === courseId);
  }
}
