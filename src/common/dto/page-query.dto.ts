import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PageQueryDto {
  @ApiProperty({
    description: '페이지 번호',
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({
    description: '페이지당 항목 수',
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;
}
