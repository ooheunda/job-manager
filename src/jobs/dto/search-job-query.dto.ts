import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PageQueryDto } from '@/common/dto';
import { JobStatus } from '@/jobs/types';

export class SearchJobQueryDto extends PageQueryDto {
  @ApiProperty({
    description: '제목 검색시 사용',
    required: false,
    nullable: true,
    example: '빨래',
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    description: '상태 검색시 사용, 미입력시 모든 상태 검색',
    required: false,
    nullable: true,
    enum: JobStatus,
    example: JobStatus.COMPLETED,
  })
  @IsEnum(JobStatus)
  @IsOptional()
  status: JobStatus;
}
