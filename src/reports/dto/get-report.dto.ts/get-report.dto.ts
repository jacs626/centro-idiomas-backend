import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';

export enum ReportType {
  RETENTION = 'retention',
  PROGRESS = 'progress',
  PAYMENTS = 'payments',
  ATTENDANCE = 'attendance',
}

export class GetReportDto {
  @IsEnum(ReportType)
  type!: ReportType;

  @IsOptional()
  @IsNumber()
  courseId?: number;

  @IsOptional()
  @IsNumber()
  groupId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;
}
