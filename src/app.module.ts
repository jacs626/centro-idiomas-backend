import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { GroupsModule } from './groups/groups.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentsModule } from './payments/payments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ProgressModule } from './progress/progress.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [UsersModule, AuthModule, CoursesModule, GroupsModule, EnrollmentsModule, PaymentsModule, AttendanceModule, ProgressModule, CertificatesModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
