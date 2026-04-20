import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding (idempotent)...');

  const password = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@test.com', password, role: 'admin' },
  });

  const profesor1 = await prisma.user.upsert({
    where: { email: 'profe1@test.com' },
    update: {},
    create: { name: 'Maria Garcia', email: 'profe1@test.com', password, role: 'profesor' },
  });

  const profesor2 = await prisma.user.upsert({
    where: { email: 'profe2@test.com' },
    update: {},
    create: { name: 'Carlos Lopez', email: 'profe2@test.com', password, role: 'profesor' },
  });

  const alumno1 = await prisma.user.upsert({
    where: { email: 'alumno1@test.com' },
    update: {},
    create: { name: 'Juan Perez', email: 'alumno1@test.com', password, role: 'alumno' },
  });

  const alumno2 = await prisma.user.upsert({
    where: { email: 'alumno2@test.com' },
    update: {},
    create: { name: 'Ana Martinez', email: 'alumno2@test.com', password, role: 'alumno' },
  });

  const alumno3 = await prisma.user.upsert({
    where: { email: 'alumno3@test.com' },
    update: {},
    create: { name: 'Pedro Gomez', email: 'alumno3@test.com', password, role: 'alumno' },
  });

  const courseA1 = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Inglés A1', level: 'A1', description: 'Curso básico de inglés' },
  });

  const courseA2 = await prisma.course.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Inglés A2', level: 'A2', description: 'Curso elemental de inglés' },
  });

  const courseB1 = await prisma.course.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Inglés B1', level: 'B1', description: 'Curso intermedio de inglés' },
  });

  const courseB2 = await prisma.course.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Inglés B2', level: 'B2', description: 'Curso intermedio-alto de inglés' },
  });

  const groupA1 = await prisma.group.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'A1-Lunes', courseId: courseA1.id, teacherId: profesor1.id, startDate: new Date('2024-01-01'), endDate: new Date('2024-06-01') },
  });

  const groupA2 = await prisma.group.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'A2-Miécoles', courseId: courseA2.id, teacherId: profesor1.id, startDate: new Date('2024-02-01'), endDate: new Date('2024-07-01') },
  });

  const groupB1 = await prisma.group.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'B1-Sábado', courseId: courseB1.id, teacherId: profesor2.id, startDate: new Date('2024-03-01'), endDate: new Date('2024-08-01') },
  });

  const groupB2A = await prisma.group.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'B2-Lunes', courseId: courseB2.id, teacherId: profesor2.id, startDate: new Date('2024-01-01'), endDate: new Date('2024-06-01') },
  });

  const groupB2B = await prisma.group.upsert({
    where: { id: 5 },
    update: {},
    create: { name: 'B2-Miécoles', courseId: courseB2.id, teacherId: profesor2.id, startDate: new Date('2024-01-01'), endDate: new Date('2024-06-01') },
  });

  const enrollment1 = await prisma.enrollment.upsert({
    where: { id: 1 },
    update: {},
    create: { userId: alumno1.id, groupId: groupA1.id, progress: 100, status: 'completed' },
  });

  const enrollment2 = await prisma.enrollment.upsert({
    where: { id: 2 },
    update: {},
    create: { userId: alumno2.id, groupId: groupA1.id, progress: 75, status: 'active' },
  });

  const enrollment3 = await prisma.enrollment.upsert({
    where: { id: 3 },
    update: {},
    create: { userId: alumno3.id, groupId: groupA2.id, progress: 40, status: 'active' },
  });

  const enrollment4 = await prisma.enrollment.upsert({
    where: { id: 4 },
    update: {},
    create: { userId: alumno1.id, groupId: groupA2.id, progress: 0, status: 'dropped' },
  });

  const enrollment5 = await prisma.enrollment.upsert({
    where: { id: 5 },
    update: {},
    create: { userId: alumno2.id, groupId: groupB2A.id, progress: 50, status: 'active' },
  });

  const enrollment6 = await prisma.enrollment.upsert({
    where: { id: 6 },
    update: {},
    create: { userId: alumno3.id, groupId: groupB2B.id, progress: 20, status: 'active' },
  });

  const existingAttendance = await prisma.attendance.findFirst({ where: { enrollmentId: enrollment1.id, date: new Date('2024-01-15') } });
  if (!existingAttendance) {
    await prisma.attendance.createMany({
      data: [
        { enrollmentId: enrollment1.id, date: new Date('2024-01-15'), status: 'present' },
        { enrollmentId: enrollment1.id, date: new Date('2024-01-22'), status: 'present' },
        { enrollmentId: enrollment1.id, date: new Date('2024-01-29'), status: 'present' },
        { enrollmentId: enrollment2.id, date: new Date('2024-01-15'), status: 'present' },
        { enrollmentId: enrollment2.id, date: new Date('2024-01-22'), status: 'absent' },
        { enrollmentId: enrollment2.id, date: new Date('2024-01-29'), status: 'late' },
        { enrollmentId: enrollment3.id, date: new Date('2024-02-05'), status: 'present' },
        { enrollmentId: enrollment3.id, date: new Date('2024-02-12'), status: 'present' },
        { enrollmentId: enrollment5.id, date: new Date('2024-01-15'), status: 'present' },
        { enrollmentId: enrollment5.id, date: new Date('2024-01-22'), status: 'present' },
        { enrollmentId: enrollment6.id, date: new Date('2024-01-17'), status: 'present' },
        { enrollmentId: enrollment6.id, date: new Date('2024-01-24'), status: 'absent' },
      ],
      skipDuplicates: true,
    });
  }

  const existingPayment = await prisma.payment.findFirst({ where: { enrollmentId: enrollment1.id, type: 'matricula' } });
  if (!existingPayment) {
    await prisma.payment.createMany({
      data: [
        { enrollmentId: enrollment1.id, amount: 150, type: 'matricula', status: 'paid', dueDate: new Date('2024-01-01'), paidAt: new Date('2024-01-01') },
        { enrollmentId: enrollment1.id, amount: 50, type: 'cuota', status: 'paid', dueDate: new Date('2024-02-01'), paidAt: new Date('2024-02-01') },
        { enrollmentId: enrollment2.id, amount: 150, type: 'matricula', status: 'paid', dueDate: new Date('2024-01-01'), paidAt: new Date('2024-01-02') },
        { enrollmentId: enrollment2.id, amount: 50, type: 'cuota', status: 'pending', dueDate: new Date('2024-02-01'), paidAt: null },
        { enrollmentId: enrollment3.id, amount: 150, type: 'matricula', status: 'pending', dueDate: new Date('2024-02-01'), paidAt: null },
        { enrollmentId: enrollment4.id, amount: 150, type: 'matricula', status: 'paid', dueDate: new Date('2024-02-01'), paidAt: new Date('2024-02-01') },
        { enrollmentId: enrollment5.id, amount: 150, type: 'matricula', status: 'paid', dueDate: new Date('2024-01-01'), paidAt: new Date('2024-01-01') },
        { enrollmentId: enrollment5.id, amount: 50, type: 'cuota', status: 'paid', dueDate: new Date('2024-02-01'), paidAt: new Date('2024-02-01') },
        { enrollmentId: enrollment6.id, amount: 150, type: 'matricula', status: 'pending', dueDate: new Date('2024-01-01'), paidAt: null },
      ],
      skipDuplicates: true,
    });
  }

  await prisma.certificate.upsert({
    where: { enrollmentId: enrollment1.id },
    update: {},
    create: { enrollmentId: enrollment1.id, fileUrl: `cert-${enrollment1.id}.pdf` },
  });

  console.log('✅ Seed completed (idempotent)');
  console.log('📧 Test logins:');
  console.log('   admin@test.com / 123456');
  console.log('   profe1@test.com / 123456');
  console.log('   alumno1@test.com / 123456');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());