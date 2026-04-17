import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from '../create-attendance.dto/create-attendance.dto';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
