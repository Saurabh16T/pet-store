// src/common/dto/response.dto.ts
export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T; // Data is optional for error responses
  error?: any; // Error can be a string or an array of validation errors

  constructor(statusCode: number, message: string, data?: T, error?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
