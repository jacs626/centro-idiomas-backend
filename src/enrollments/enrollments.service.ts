import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user?: { sub: number; role: string }) {
    const where =
      user?.role === 'profesor' ? { group: { teacherId: user.sub } } : {};
    return this.prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { include: { course: true } },
      },
    });
  }

  async create(dto: CreateEnrollmentDto) {
    return this.prisma.enrollment.create({
      data: {
        ...dto,
        progress: 0,
        status: 'active',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    return this.prisma.enrollment.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async remove(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    await this.prisma.enrollment.delete({ where: { id } });
    return enrollment;
  }

  async findByUser(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async findByUserFilter(where: any) {
    return this.prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { include: { course: true } },
      },
    });
  }

  async findByGroup(groupId: number, user?: { sub: number; role: string }) {
    const where: any = { groupId };
    if (user?.role === 'profesor') {
      where.group = { teacherId: user.sub };
    }
    return this.prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { include: { course: true } },
      },
    });
  }

  async findByUserAndGroup(userId: number, groupId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId, groupId },
    });
  }

  async findById(id: number) {
    return this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async getProgressByUserAndGroup(userId: number, groupId: number) {
    console.log(
      '[getProgress service] Buscando enrollment para userId:',
      userId,
      'groupId:',
      groupId,
    );
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { userId, groupId },
      include: {
        group: {
          include: { course: true },
        },
      },
    });

    console.log('[getProgress service] Enrollment encontrado:', enrollment);

    if (!enrollment) {
      return null;
    }

    return {
      progress: enrollment.progress,
      status: enrollment.status,
      group: enrollment.group.name,
      course: enrollment.group.course.name,
      courseLevel: enrollment.group.course.level,
    };
  }

  async getProgressByUser(userId: number) {
    console.log(
      '[getProgressByUser] Buscando enrollments para userId:',
      userId,
    );
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        group: {
          include: { course: true },
        },
      },
    });

    console.log(
      '[getProgressByUser] Enrollments encontrados:',
      enrollments.length,
    );

    return enrollments.map((e) => ({
      progress: e.progress,
      status: e.status,
      group: e.group.name,
      course: e.group.course.name,
      courseLevel: e.group.course.level,
      groupId: e.groupId,
      courseId: e.group.courseId,
    }));
  }

  async getMyStudents(teacherId: number, groupId?: number, courseId?: number) {
    const where: any = {
      group: { teacherId },
    };
    if (groupId) where.groupId = groupId;
    if (courseId) where.group = { ...where.group, courseId };

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { include: { course: true } },
        payments: true,
        attendance: true,
      },
    });

    return enrollments.map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.user.name,
      userEmail: e.user.email,
      groupId: e.groupId,
      groupName: e.group.name,
      courseId: e.group.courseId,
      courseName: e.group.course.name,
      courseLevel: e.group.course.level,
      progress: e.progress,
      status: e.status,
      payments: e.payments,
      attendance: e.attendance,
    }));
  }

  async getStudentsByFilters(groupId?: number, courseId?: number) {
    const where: any = {};
    if (groupId) where.groupId = groupId;
    if (courseId) where.group = { courseId };

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        group: { include: { course: true } },
      },
    });

    return enrollments.map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.user.name,
      userEmail: e.user.email,
      userRole: e.user.role,
      groupId: e.groupId,
      groupName: e.group.name,
      courseId: e.group.courseId,
      courseName: e.group.course.name,
      courseLevel: e.group.course.level,
      progress: e.progress,
      status: e.status,
    }));
  }
}
