import { IsOptional, IsIn, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsIn(['pending', 'paid', 'late'])
  status?: 'pending' | 'paid' | 'late';

  @IsOptional()
  @IsString()
  paidAt?: string;
}
