import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PageQueryDto } from '@/common/dto';
import { JobStatus } from '@/jobs/types';

export class SearchJobQueryDto extends PageQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status: JobStatus;
}
