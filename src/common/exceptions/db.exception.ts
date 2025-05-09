import { HttpStatus } from '@nestjs/common';

export class DBError extends Error {
  constructor(
    public readonly message: string = 'DB 오류가 발생하였습니다.',
    public readonly details: string,
    public readonly status = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
  }
}
