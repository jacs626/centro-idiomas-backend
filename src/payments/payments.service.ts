import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment no existe');
    }

    return this.prisma.payment.create({
      data: {
        enrollmentId: dto.enrollmentId,
        amount: dto.amount,
        type: dto.type,
        status: dto.status,
        dueDate: new Date(dto.dueDate),
        paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
      },
    });
  }

  async markAsPaid(id: number) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }

  async findByEnrollment(enrollmentId: number) {
    return this.prisma.payment.findMany({
      where: { enrollmentId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findByGroup(groupId: number) {
    return this.prisma.payment.findMany({
      where: {
        enrollment: {
          groupId,
        },
      },
      include: {
        enrollment: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findByCourse(courseId: number, status?: string) {
    const where: any = {
      enrollment: {
        group: {
          courseId,
        },
      },
    };
    if (status) {
      where.status = status;
    }
    return this.prisma.payment.findMany({
      where,
      include: {
        enrollment: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            group: { include: { course: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async markLatePayments() {
    const now = new Date();

    return this.prisma.payment.updateMany({
      where: {
        dueDate: { lt: now },
        status: 'pending',
      },
      data: {
        status: 'late',
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.payment.findMany({
      where: {
        enrollment: {
          userId,
        },
      },
      include: {
        enrollment: {
          include: {
            group: {
              include: { course: true },
            },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findAll(filters?: {
    groupId?: number;
    courseId?: number;
    status?: string;
  }) {
    if (filters?.courseId && !filters?.groupId) {
      return this.findByCourse(filters.courseId, filters.status);
    }

    const where: any = {};
    if (filters?.groupId) {
      where.enrollment = { groupId: filters.groupId };
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    return this.prisma.payment.findMany({
      where,
      include: {
        enrollment: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            group: { include: { course: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}
