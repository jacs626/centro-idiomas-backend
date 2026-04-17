import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generate(enrollmentId: number, res: Response) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        group: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment no existe');
    }

    if (enrollment.progress < 80) {
      throw new BadRequestException(
        'No cumple el mínimo para certificado (80%)',
      );
    }

    await this.prisma.certificate.upsert({
      where: { enrollmentId },
      update: {
        issuedAt: new Date(),
      },
      create: {
        enrollmentId,
        fileUrl: `cert-${enrollmentId}.pdf`,
      },
    });

    return this.generatePdf(enrollment, res);
  }

  async download(enrollmentId: number, res: Response) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { enrollmentId },
      include: {
        enrollment: {
          include: {
            user: true,
            group: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificado no encontrado');
    }

    return this.generatePdf(certificate.enrollment, res);
  }

  async findAll() {
    return this.prisma.certificate.findMany({
      include: {
        enrollment: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            group: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
  }

  async findByEnrollment(enrollmentId: number) {
    const cert = await this.prisma.certificate.findUnique({
      where: { enrollmentId },
    });

    if (!cert) {
      throw new NotFoundException('Certificado no encontrado');
    }

    return cert;
  }

  async findByGroup(groupId: number) {
    return this.prisma.certificate.findMany({
      where: {
        enrollment: {
          groupId,
        },
      },
      include: {
        enrollment: {
          include: {
            user: { select: { id: true, name: true } },
            group: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async checkByEnrollment(enrollmentId: number) {
    const cert = await this.prisma.certificate.findUnique({
      where: { enrollmentId },
    });
    return { exists: !!cert, enrollmentId };
  }

  async viewOrGenerate(enrollmentId: number, res: Response) {
    const cert = await this.prisma.certificate.findUnique({
      where: { enrollmentId },
    });

    if (cert) {
      return this.download(enrollmentId, res);
    }

    return this.generate(enrollmentId, res);
  }

  async findByUser(userId: number) {
    return this.prisma.certificate.findMany({
      where: {
        enrollment: {
          userId,
        },
      },
      include: {
        enrollment: {
          include: {
            user: { select: { id: true, name: true } },
            group: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  private generatePdf(enrollment: any, res: Response) {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=cert-${enrollment.id}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(22).text('CERTIFICADO', { align: 'center' });

    doc.moveDown();
    doc.fontSize(14).text(`Alumno: ${enrollment.user.name}`);
    doc.text(`Curso: ${enrollment.group.course.name}`);
    doc.text(`Grupo: ${enrollment.group.name}`);
    doc.text(`Progreso: ${enrollment.progress}%`);

    doc.moveDown();
    doc.text('Ha completado el curso satisfactoriamente.');

    doc.moveDown();
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`Código: CERT-${enrollment.id}`);

    doc.end();
  }
}
