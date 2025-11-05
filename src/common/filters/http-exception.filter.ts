import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto';  // Your standardized response DTO

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = '';
    let error = '';

    // Standardized messages for common HTTP status codes
    const statusMessages: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };

    // Determine the general message based on status code
    message = statusMessages[status] || 'Something went wrong';

    // Check if exceptionResponse is an object and has a message
    if (typeof exceptionResponse === 'object') {
      if ('message' in exceptionResponse) {
        // Default to the provided message, or use 'Something went wrong'
        error = (exceptionResponse as any).message || 'Something went wrong';
      } else {
        // If no message field is present, treat the object as a generic error
        error = 'An error occurred';
      }
    } else {
      // If it's a string (the exception message), use it as the error
      error = exceptionResponse as string || 'An error occurred';
    }

    // Now we have the message as the general error message (e.g., "Bad Request")
    // and the error as the specific message or error description (e.g., "User not found")

    // Build the response object with status, message, and error
    const responseBody = new ApiResponse(status, message, null, error);

    // Return the response with the custom structure
    response.status(status).json(responseBody);
  }
}