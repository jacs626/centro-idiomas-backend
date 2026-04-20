import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto/update-enrollment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: number; role: string; email: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @Roles('admin', 'profesor')
  findAll(@Req() req: RequestWithUser) {
    return this.enrollmentsService.findAll(req.user);
  }

  @Get('students')
  @Roles('admin')
  getStudentsByFilters(
    @Query('groupId') groupId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.getStudentsByFilters(
      groupId ? Number(groupId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
  }

  @Get('by-user')
  @Roles('admin', 'profesor')
  findByUser(@Query('userId') userId: string, @Req() req: RequestWithUser) {
    const where =
      req.user.role === 'profesor'
        ? { userId: Number(userId), group: { teacherId: req.user.sub } }
        : { userId: Number(userId) };
    return this.enrollmentsService.findByUserFilter(where);
  }

  @Get('progress/:groupId')
  @Roles('admin', 'profesor', 'alumno')
  getProgressByUserAndGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('userId') userId: string,
    @Req() req: RequestWithUser,
  ) {
    const finalUserId = userId || String(req.user.sub);
    console.log('[getProgress] userId:', finalUserId, 'groupId:', groupId);
    return this.enrollmentsService.getProgressByUserAndGroup(
      Number(finalUserId),
      groupId,
    );
  }

  @Get('my-progress')
  @Roles('alumno')
  getMyProgress(@Req() req: RequestWithUser) {
    console.log('[getMyProgress] userId:', req.user.sub);
    console.log('[getMyProgress] role:', req.user.role);
    return this.enrollmentsService.getProgressByUser(req.user.sub);
  }

  @Get('by-group')
  @Roles('admin', 'profesor')
  findByGroup(@Query('groupId') groupId: string, @Req() req: RequestWithUser) {
    return this.enrollmentsService.findByGroup(Number(groupId), req.user);
  }

  @Get('my-students')
  @Roles('profesor')
  getMyStudents(
    @Req() req: RequestWithUser,
    @Query('groupId') groupId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.getMyStudents(
      req.user.sub,
      groupId ? Number(groupId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Patch(':id')
  @Roles('admin', 'profesor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, dto);
  }
}
