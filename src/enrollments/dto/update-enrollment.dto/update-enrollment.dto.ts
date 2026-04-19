import { IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateEnrollmentDto {
  @IsIn(['active', 'dropped', 'completed'])
  @IsOptional()
  status?: 'active' | 'dropped' | 'completed';

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
}
