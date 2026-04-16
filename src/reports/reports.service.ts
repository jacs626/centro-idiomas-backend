import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}
  async getGroupRetention(groupId: number) {
    const total = await this.prisma.enrollment.count({
      where: { groupId },
    });

    const active = await this.prisma.enrollment.count({
      where: {
        groupId,
        status: 'active',
      },
    });

    const completed = await this.prisma.enrollment.count({
      where: {
        groupId,
        status: 'completed',
      },
    });

    const dropped = await this.prisma.enrollment.count({
      where: {
        groupId,
        status: 'dropped',
      },
    });

    const retained = active + completed;

    return {
      groupId,
      total,
      active,
      completed,
      dropped,
      retention: total ? (retained / total) * 100 : 0,
    };
  }

  async getGlobalRetention() {
    const total = await this.prisma.enrollment.count();

    const active = await this.prisma.enrollment.count({
      where: { status: 'active' },
    });

    const completed = await this.prisma.enrollment.count({
      where: { status: 'completed' },
    });

    const dropped = await this.prisma.enrollment.count({
      where: { status: 'dropped' },
    });

    const retained = active + completed;

    return {
      total,
      active,
      completed,
      dropped,
      retention: total ? (retained / total) * 100 : 0,
    };
  }

  async getRetentionByCourse(courseId: number) {
    const groups = await this.prisma.group.findMany({
      where: { courseId },
      include: {
        enrollments: true,
      },
    });

    let total = 0;
    let retained = 0;

    for (const group of groups) {
      total += group.enrollments.length;

      retained += group.enrollments.filter(
        (e) => e.status === 'active' || e.status === 'completed',
      ).length;
    }

    return {
      courseId,
      total,
      retention: total ? (retained / total) * 100 : 0,
    };
  }
}
