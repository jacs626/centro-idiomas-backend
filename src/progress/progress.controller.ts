import { Controller, Get, Post, Body, Patch, Delete, Param, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto/update-progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  findAll() {
    return this.progressService.findAll();
  }

  @Get('by-user')
  findByUser(@Query('userId') userId: string) {
    return this.progressService.findByUser(Number(userId));
  }

  @Get('by-course')
  findByCourse(@Query('courseId') courseId: string) {
    return this.progressService.findByCourse(Number(courseId));
  }

  @Post()
  create(@Body() dto: CreateProgressDto) {
    return this.progressService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProgressDto) {
    return this.progressService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(Number(id));
  }
}