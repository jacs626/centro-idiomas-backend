import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: number, role: string) {
    const notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      createdAt: string;
      read: boolean;
    }> = [];

    if (role === 'alumno') {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { userId, status: { in: ['active', 'completed'] } },
        include: { group: { include: { course: true } } },
      });

      for (const enrollment of enrollments) {
        const payments = await this.prisma.payment.findMany({
          where: { enrollmentId: enrollment.id },
        });

        const latePayments = payments.filter((p) => p.status === 'late');
        if (latePayments.length > 0) {
          notifications.push({
            id: `payment-${enrollment.id}`,
            type: 'payment',
            title: 'Pago vencido',
            message: `Tienes ${latePayments.length} pago(s) vencido(s) en el curso ${enrollment.group.course.name}`,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }

        if (enrollment.progress >= 80) {
          const existingCert = await this.prisma.certificate.findUnique({
            where: { enrollmentId: enrollment.id },
          });
          if (!existingCert) {
            if (enrollment.status === 'completed') {
              notifications.push({
                id: `cert-${enrollment.id}`,
                type: 'certificate',
                title: 'Certificado disponible',
                message: `¡Felicidades! Ya puedes descargar tu certificado de ${enrollment.group.course.name}`,
                createdAt: new Date().toISOString(),
                read: false,
              });
            } else {
              notifications.push({
                id: `cert-ready-${enrollment.id}`,
                type: 'certificate',
                title: 'Certificado próximo',
                message: `Con ${enrollment.progress}% de progreso ya puedes obtener tu certificado de ${enrollment.group.course.name}`,
                createdAt: new Date().toISOString(),
                read: false,
              });
            }
          }
        }

        if (enrollment.progress < 50 && enrollment.status === 'active') {
          notifications.push({
            id: `progress-${enrollment.id}`,
            type: 'progress',
            title: 'Bajo progreso',
            message: `Tu progreso en ${enrollment.group.course.name} es del ${enrollment.progress}%. ¡Sigue estudiando!`,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }
      }

      const pendingPayments = await this.prisma.payment.findMany({
        where: { enrollment: { userId }, status: 'pending' },
      });
      if (pendingPayments.length > 0) {
        const totalPending = pendingPayments.reduce(
          (sum, p) => sum + Number(p.amount),
          0,
        );
        notifications.push({
          id: 'pending-payments',
          type: 'payment',
          title: 'Pagos pendientes',
          message: `Tienes ${pendingPayments.length} pago(s) pendiente(s) por un total de $${totalPending}`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    }

    if (role === 'admin' || role === 'profesor') {
      if (role === 'admin') {
        const latePayments = await this.prisma.payment.findMany({
          where: { status: 'late' },
        });
        if (latePayments.length > 0) {
          notifications.push({
            id: 'admin-late-payments',
            type: 'payment',
            title: 'Pagos vencidos',
            message: `Hay ${latePayments.length} pago(s) vencido(s) sin cobrar`,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }

        const activeEnrollments = await this.prisma.enrollment.count({
          where: { status: 'active' },
        });
        const completedEnrollments = await this.prisma.enrollment.count({
          where: { status: 'completed' },
        });
        if (completedEnrollments > activeEnrollments * 0.5) {
          notifications.push({
            id: 'admin-completion',
            type: 'enrollment',
            title: 'Alumnos completados',
            message: `${completedEnrollments} alumno(s) han completado su curso`,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }
      }

      if (role === 'profesor') {
        const students = await this.prisma.enrollment.findMany({
          where: { group: { teacherId: userId }, status: 'active' },
          include: { user: true },
        });
        const lowProgress = students.filter((s) => s.progress < 50);
        if (lowProgress.length > 0) {
          notifications.push({
            id: 'profesor-low-progress',
            type: 'progress',
            title: 'Bajo progreso',
            message: `${lowProgress.length} alumno(s) tienen menos del 50% de progreso`,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }
      }
    }

    return notifications;
  }

  async getBadgeCount(userId: number, role: string) {
    const notifications = await this.getNotifications(userId, role);
    return { count: notifications.length };
  }
}
