import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

import { JobStatus } from '@/jobs/types';

export class CreateJobDto {
  @ApiProperty({
    description: '작업 제목',
    required: true,
    example: '빨래하기',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '작업 설명',
    required: true,
    example: '옷을 세탁기에 넣는다. 세제를 넣는다. 세탁기를 작동시킨다. 비가 오지 않길 기도한다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '작업 상태',
    required: false,
    enum: JobStatus,
    nullable: true,
    default: JobStatus.PENDING,
    example: JobStatus.PENDING,
  })
  @IsOptional()
  @IsString()
  @IsEnum(JobStatus)
  status: JobStatus;
}
