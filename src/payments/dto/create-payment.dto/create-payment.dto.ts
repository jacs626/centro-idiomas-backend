import { IsNumber, IsDateString, IsIn, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  enrollmentId!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsIn(['matricula', 'cuota'])
  type!: 'matricula' | 'cuota';

  @IsIn(['pending', 'paid', 'late'])
  status!: 'pending' | 'paid' | 'late';

  @IsDateString()
  dueDate!: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}
