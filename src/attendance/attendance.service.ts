import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto/update-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttendanceDto, user?: { sub: number; role: string }) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
      include: { group: true },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment no existe');
    }

    if (user?.role === 'profesor' && enrollment.group.teacherId !== user.sub) {
      throw new BadRequestException('No tienes permiso para registrar asistencia en este grupo');
    }

    const existing = await this.prisma.attendance.findFirst({
      where: {
        enrollmentId: dto.enrollmentId,
        date: new Date(dto.date),
      },
    });

    if (existing) {
      throw new BadRequestException('Asistencia ya registrada para este día');
    }

    return this.prisma.attendance.create({
      data: {
        enrollmentId: dto.enrollmentId,
        date: new Date(dto.date),
        status: dto.status,
      },
    });
  }

  async findByEnrollment(
    enrollmentId: number,
    user?: { sub: number; role: string },
  ) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { group: true },
    });

    if (!enrollment) {
      return [];
    }

    if (user?.role === 'alumno' && enrollment.userId !== user.sub) {
      return [];
    }

    return this.prisma.attendance.findMany({
      where: { enrollmentId },
      orderBy: { date: 'asc' },
    });
  }

  async findByGroup(groupId: number, user?: { sub: number; role: string }) {
    if (user?.role === 'profesor') {
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
        select: { teacherId: true },
      });
      if (group?.teacherId !== user.sub) {
        return [];
      }
    }
    return this.prisma.attendance.findMany({
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
      orderBy: { date: 'asc' },
    });
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance no encontrada');
    }

    return this.prisma.attendance.update({
      where: { id },
      data: {
        status: dto.status,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async getAttendanceByUser(userId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: { in: ['active', 'completed'] } },
      include: {
        group: {
          include: { course: true },
        },
      },
    });

    const attendanceData = await Promise.all(
      enrollments.map(async (enrollment) => {
        const attendance = await this.prisma.attendance.findMany({
          where: { enrollmentId: enrollment.id },
          orderBy: { date: 'asc' },
        });
        return {
          enrollmentId: enrollment.id,
          course: enrollment.group.course.name,
          courseLevel: enrollment.group.course.level,
          group: enrollment.group.name,
          attendance,
        };
      }),
    );

    return attendanceData;
  }
}
