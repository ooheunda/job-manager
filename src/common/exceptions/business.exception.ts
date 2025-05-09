import { HttpStatus } from '@nestjs/common';

export class BusinessException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: HttpStatus,
    public readonly details?: string,
  ) {
    super(message);
  }
}
