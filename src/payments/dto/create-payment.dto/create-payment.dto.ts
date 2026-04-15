import { IsNumber, IsString, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  groupId!: number;

  @IsNumber()
  amount!: number;

  @IsIn(['matricula', 'cuota'])
  type!: 'matricula' | 'cuota';

  @IsIn(['pending', 'paid', 'late'])
  status!: 'pending' | 'paid' | 'late';

  @IsString()
  dueDate!: string;
}
