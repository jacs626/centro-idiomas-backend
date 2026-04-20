import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: number; role: string; email: string };
}

@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('generate/:id')
  @Roles('admin', 'profesor')
  generate(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.certificatesService.generate(id, res);
  }

  @Get('generate/enrollment/:enrollmentId')
  @Roles('admin', 'profesor')
  generateByEnrollment(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Res() res: Response,
  ) {
    return this.certificatesService.generate(enrollmentId, res);
  }

  @Get('download/:id')
  @Roles('admin', 'profesor')
  download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.certificatesService.download(id, res);
  }

  @Get('my-certificates')
  @Roles('alumno')
  getMyCertificates(@Req() req: RequestWithUser) {
    return this.certificatesService.findByUser(req.user.sub);
  }

  @Get('check/:enrollmentId')
  @Roles('alumno')
  checkCertificate(@Param('enrollmentId', ParseIntPipe) enrollmentId: number) {
    return this.certificatesService.checkByEnrollment(enrollmentId);
  }

  @Get('view/:enrollmentId')
  @Roles('alumno')
  viewCertificate(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Res() res: Response,
  ) {
    return this.certificatesService.viewOrGenerate(enrollmentId, res);
  }

  @Get('download/:enrollmentId')
  @Roles('alumno')
  downloadMyCertificate(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Res() res: Response,
  ) {
    return this.certificatesService.download(enrollmentId, res);
  }

  @Get()
  @Roles('admin', 'profesor')
  findAll(@Req() req: RequestWithUser) {
    return this.certificatesService.findAll(req.user);
  }

  @Get('by-group/:groupId')
  @Roles('admin', 'profesor')
  findByGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.certificatesService.findByGroup(groupId, req.user);
  }

  @Get('enrollment/:id')
  @Roles('admin', 'profesor')
  findByEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.certificatesService.findByEnrollment(id, req.user);
  }
}
