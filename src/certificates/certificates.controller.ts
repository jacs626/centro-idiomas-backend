import { Controller, Get, Post, Body, Patch, Delete, Param, Query } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto/update-certificate.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get('by-user')
  findByUser(@Query('userId') userId: string) {
    return this.certificatesService.findByUser(Number(userId));
  }

  @Get('by-course')
  findByCourse(@Query('courseId') courseId: string) {
    return this.certificatesService.findByCourse(Number(courseId));
  }

  @Post()
  create(@Body() dto: CreateCertificateDto) {
    return this.certificatesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.certificatesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(Number(id));
  }
}