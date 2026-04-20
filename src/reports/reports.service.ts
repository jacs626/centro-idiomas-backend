import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const totalEnrollments = await this.prisma.enrollment.count();

    const active = await this.prisma.enrollment.count({
      where: { status: 'active' },
    });
    const completed = await this.prisma.enrollment.count({
      where: { status: 'completed' },
    });
    const dropped = await this.prisma.enrollment.count({
      where: { status: 'dropped' },
    });

    const retention = totalEnrollments
      ? ((active + completed) / totalEnrollments) * 100
      : 0;

    const totalPayments = await this.prisma.payment.count();
    const paidPayments = await this.prisma.payment.count({
      where: { status: 'paid' },
    });
    const pendingPayments = await this.prisma.payment.count({
      where: { status: 'pending' },
    });
    const latePayments = await this.prisma.payment.count({
      where: { status: 'late' },
    });

    const totalIncome = await this.prisma.payment.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
    });

    const paymentsStats = {
      total: totalPayments,
      paid: paidPayments,
      pending: pendingPayments,
      late: latePayments,
      paidPercent: totalPayments ? (paidPayments / totalPayments) * 100 : 0,
      pendingPercent: totalPayments
        ? (pendingPayments / totalPayments) * 100
        : 0,
      latePercent: totalPayments ? (latePayments / totalPayments) * 100 : 0,
      totalIncome: totalIncome._sum.amount || 0,
    };

    return {
      enrollments: {
        total: totalEnrollments,
        active,
        completed,
        dropped,
        retention: Math.round(retention * 10) / 10,
      },
      payments: paymentsStats,
    };
  }

  async getGroupsSummary() {
    const groups = await this.prisma.group.findMany({
      include: {
        course: true,
        enrollments: true,
      },
    });

    const result = await Promise.all(
      groups.map(async (group) => {
        const total = group.enrollments.length;
        const active = group.enrollments.filter(
          (e) => e.status === 'active',
        ).length;
        const completed = group.enrollments.filter(
          (e) => e.status === 'completed',
        ).length;
        const dropped = group.enrollments.filter(
          (e) => e.status === 'dropped',
        ).length;
        const retention = total ? ((active + completed) / total) * 100 : 0;

        const avgProgress =
          group.enrollments.length > 0
            ? group.enrollments.reduce((sum, e) => sum + e.progress, 0) /
              group.enrollments.length
            : 0;

        return {
          groupId: group.id,
          groupName: group.name,
          courseName: group.course.name,
          total,
          active,
          completed,
          dropped,
          retention: Math.round(retention * 10) / 10,
          avgProgress: Math.round(avgProgress * 10) / 10,
        };
      }),
    );

    return result;
  }

  async getGroupsSummaryByCourse(courseId: number) {
    const groups = await this.prisma.group.findMany({
      where: { courseId },
      include: {
        course: true,
        enrollments: true,
      },
    });

    const result = groups.map((group) => {
      const total = group.enrollments.length;
      const active = group.enrollments.filter(
        (e) => e.status === 'active',
      ).length;
      const completed = group.enrollments.filter(
        (e) => e.status === 'completed',
      ).length;
      const dropped = group.enrollments.filter(
        (e) => e.status === 'dropped',
      ).length;
      const retention = total ? ((active + completed) / total) * 100 : 0;

      const avgProgress =
        group.enrollments.length > 0
          ? group.enrollments.reduce((sum, e) => sum + e.progress, 0) /
            group.enrollments.length
          : 0;

      return {
        groupId: group.id,
        groupName: group.name,
        courseName: group.course.name,
        total,
        active,
        completed,
        dropped,
        retention: Math.round(retention * 10) / 10,
        avgProgress: Math.round(avgProgress * 10) / 10,
      };
    });

    return result;
  }

  async getGroupReports(groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { course: true },
    });

    if (!group) return null;

    const enrollments = await this.prisma.enrollment.findMany({
      where: { groupId },
    });
    const total = enrollments.length;
    const active = enrollments.filter((e) => e.status === 'active').length;
    const completed = enrollments.filter(
      (e) => e.status === 'completed',
    ).length;
    const dropped = enrollments.filter((e) => e.status === 'dropped').length;
    const retention = total ? ((active + completed) / total) * 100 : 0;

    const avgProgress =
      total > 0
        ? enrollments.reduce((sum, e) => sum + e.progress, 0) / total
        : 0;

    const enrollmentsIds = enrollments.map((e) => e.id);
    const attendances = await this.prisma.attendance.findMany({
      where: { enrollmentId: { in: enrollmentsIds } },
    });
    const presentCount = attendances.filter(
      (a) => a.status === 'present',
    ).length;
    const absentCount = attendances.filter((a) => a.status === 'absent').length;
    const lateCount = attendances.filter((a) => a.status === 'late').length;
    const totalAttendance = attendances.length;

    const payments = await this.prisma.payment.findMany({
      where: { enrollment: { groupId: groupId } },
    });
    const paid = payments.filter((p) => p.status === 'paid').length;
    const pending = payments.filter((p) => p.status === 'pending').length;
    const late = payments.filter((p) => p.status === 'late').length;
    const totalPayments = payments.length;
    const totalIncome = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      groupId: group.id,
      groupName: group.name,
      courseName: group.course.name,
      enrollments: {
        total,
        active,
        completed,
        dropped,
        retention: Math.round(retention * 10) / 10,
      },
      avgProgress: Math.round(avgProgress * 10) / 10,
      attendance: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        presentPercent: totalAttendance
          ? (presentCount / totalAttendance) * 100
          : 0,
        absentPercent: totalAttendance
          ? (absentCount / totalAttendance) * 100
          : 0,
        latePercent: totalAttendance ? (lateCount / totalAttendance) * 100 : 0,
      },
      payments: {
        total: totalPayments,
        paid,
        pending,
        late,
        paidPercent: totalPayments ? (paid / totalPayments) * 100 : 0,
        pendingPercent: totalPayments ? (pending / totalPayments) * 100 : 0,
        latePercent: totalPayments ? (late / totalPayments) * 100 : 0,
        totalIncome,
      },
    };
  }

  async getGroupRetention(groupId: number) {
    const total = await this.prisma.enrollment.count({ where: { groupId } });
    const active = await this.prisma.enrollment.count({
      where: { groupId, status: 'active' },
    });
    const completed = await this.prisma.enrollment.count({
      where: { groupId, status: 'completed' },
    });
    const dropped = await this.prisma.enrollment.count({
      where: { groupId, status: 'dropped' },
    });
    const retention = total ? ((active + completed) / total) * 100 : 0;
    return {
      groupId,
      total,
      active,
      completed,
      dropped,
      retention: Math.round(retention * 10) / 10,
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
    const retention = total ? ((active + completed) / total) * 100 : 0;
    return {
      total,
      active,
      completed,
      dropped,
      retention: Math.round(retention * 10) / 10,
    };
  }

  async getRetentionByCourse(courseId: number) {
    const groups = await this.prisma.group.findMany({
      where: { courseId },
      include: { enrollments: true },
    });
    let total = 0,
      retained = 0;
    for (const group of groups) {
      total += group.enrollments.length;
      retained += group.enrollments.filter(
        (e) => e.status === 'active' || e.status === 'completed',
      ).length;
    }
    return { courseId, total, retention: total ? (retained / total) * 100 : 0 };
  }
}
