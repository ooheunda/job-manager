import { ApiProperty } from '@nestjs/swagger';

export class BaseResDto<T> {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공하였습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터 (구체적인 타입은 각 엔드포인트에서 정의)',
    example: {},
    nullable: true,
  })
  data: T;

  @ApiProperty({
    description: '에러',
    example: null,
    nullable: true,
  })
  error?: error;

  constructor(success: boolean, message: string, data: T, error: null | error) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
interface error {
  code: string;
  statusCode: number;
}
