import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'profesor')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('generate/:id')
  generate(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.certificatesService.generate(id, res);
  }

  @Get('generate/enrollment/:enrollmentId')
  generateByEnrollment(@Param('enrollmentId', ParseIntPipe) enrollmentId: number, @Res() res: Response) {
    return this.certificatesService.generate(enrollmentId, res);
  }

  @Get('download/:id')
  download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.certificatesService.download(id, res);
  }

  @Get()
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get('enrollment/:id')
  findByEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.certificatesService.findByEnrollment(id);
  }
}
