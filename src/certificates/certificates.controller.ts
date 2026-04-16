import { Controller, Get, Param, Res, ParseIntPipe } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('generate/:id')
  generate(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.certificatesService.generate(id, res);
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
