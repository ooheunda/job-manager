import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

import { JobStatus } from '@/jobs/types';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsEnum(JobStatus)
  status: JobStatus;
}
