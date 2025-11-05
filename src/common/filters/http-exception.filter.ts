import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto'; // Your standardized response DTO

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500; // Default to Internal Server Error
    let errorMessage = 'Something went wrong';

    // Check if the exception is an instance of HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus(); // Get status if it's an HttpException
      
      // If the exception response is an object, we need to extract the message
      const responseMessage = exception.getResponse();
      if (typeof responseMessage === 'object' && 'message' in responseMessage) {
        errorMessage = (responseMessage as any).message;
      } else {
        // If it's a string or other object, use it as the error message
        errorMessage = typeof responseMessage === 'string' ? responseMessage : 'An error occurred';
      }
    } else if (exception instanceof Error) {
      // Handle other types of error like JavaScript errors or Prisma errors
      errorMessage = exception.message || 'An error occurred';
    }

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

    // Get the general message based on the status code
    const message = statusMessages[status] || 'Something went wrong';

    // Build the response object with status, message, and error
    const responseBody = new ApiResponse(status, message, null, errorMessage);

    // Send the response
    response.status(status).json(responseBody);
  }
}