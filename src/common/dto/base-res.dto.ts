export class BaseResDto<T> {
  success: boolean;
  message: string;
  data: T;
  error: null | error;

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
