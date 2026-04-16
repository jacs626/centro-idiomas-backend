import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [EnrollmentsModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
