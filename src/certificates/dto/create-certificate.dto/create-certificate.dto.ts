import { IsNumber } from 'class-validator';

export class CreateCertificateDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  courseId!: number;
}
