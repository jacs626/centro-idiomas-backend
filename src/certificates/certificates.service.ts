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

async findAll(user: any) {
    const where = user.role === 'profesor'
      ? { enrollment: { group: { teacherId: user.sub } } }
      : {};
    return this.prisma.certificate.findMany({
      where,
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

  async findByGroup(groupId: number, user: any) {
    if (user.role === 'profesor') {
      const group = await this.prisma.group.findUnique({ where: { id: groupId } });
      if (!group || group.teacherId !== user.sub) {
        throw new ForbiddenException('No tienes acceso a este grupo');
      }
    }
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
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=certificado-${enrollment.user.name.replace(/\s+/g, '-')}-${enrollment.group.course.name}.pdf`,
    );

    doc.pipe(res);

    const pageHeight = doc.page.height;
    const pageWidth = doc.page.width;

    // Fondo
    doc.fillColor('#f8fafc').rect(0, 0, pageWidth, pageHeight).fill();

    // Borde exterior
    doc
      .rect(10, 10, pageWidth - 20, pageHeight - 20)
      .lineWidth(3)
      .stroke('#4f46e5');
    doc
      .rect(18, 18, pageWidth - 36, pageHeight - 36)
      .lineWidth(1)
      .stroke('#c7d2fe');

    // Header
    doc.rect(18, 18, pageWidth - 36, 100).fill('#4f46e5');
    doc
      .fontSize(38)
      .fillColor('#ffffff')
      .text('CERTIFICADO', { align: 'center', y: 55 });
    doc
      .fontSize(12)
      .fillColor('#c7d2fe')
      .text('CENTRO DE IDIOMAS GLOBAL', { align: 'center', y: 90 });

    // Contenido principal
    doc.fillColor('#1e293b');
    doc.moveDown(7);
    doc
      .fontSize(12)
      .fillColor('#64748b')
      .text('Este certificado acredita que', { align: 'center' });

    doc.moveDown(0.8);
    doc
      .fontSize(28)
      .fillColor('#1e293b')
      .text(enrollment.user.name, { align: 'center' });

    doc.moveDown(0.8);
    doc
      .fontSize(12)
      .fillColor('#64748b')
      .text('ha completado exitosamente el curso de', { align: 'center' });

    doc.moveDown(0.6);
    doc
      .fontSize(22)
      .fillColor('#4f46e5')
      .text(enrollment.group.course.name, { align: 'center' });

    doc.moveDown(0.5);
    doc
      .fontSize(13)
      .fillColor('#64748b')
      .text(
        `Nivel ${enrollment.group.course.level} • Grupo ${enrollment.group.name} • Progreso: ${enrollment.progress}%`,
        { align: 'center' },
      );

    doc.moveDown(2);
    doc
      .fontSize(12)
      .fillColor('#1e293b')
      .text('Felicitaciones por su dedicación y esfuerzo.', {
        align: 'center',
      });

    // Pie de página
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.moveDown(2.5);
    doc
      .fontSize(10)
      .fillColor('#64748b')
      .text(`Fecha de emisión: ${fecha}`, { align: 'center' });
    doc
      .fontSize(9)
      .fillColor('#94a3b8')
      .text(
        `Código de verificación: CERT-${enrollment.id}-${Date.now().toString().slice(-6)}`,
        { align: 'center' },
      );

    // Firma
    doc.moveDown(10);
    doc
      .moveTo(180, doc.y + 5)
      .lineTo(340, doc.y + 5)
      .lineWidth(0.5)
      .stroke('#94a3b8');
    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text('Director Académico', 180, doc.y + 10, {
        width: 160,
        align: 'center',
      });

    doc.end();
  }
}
