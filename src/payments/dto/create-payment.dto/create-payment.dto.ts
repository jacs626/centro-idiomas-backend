import { IsNumber, IsDateString, IsIn, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  enrollmentId!: number;

  @IsNumber()
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
