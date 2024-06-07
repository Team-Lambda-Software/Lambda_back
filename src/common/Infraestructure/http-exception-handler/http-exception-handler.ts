import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
  } from '@nestjs/common';
import { IExceptionHandler } from 'src/common/Application/exception-handler/exception-handler.interface'
  
  export class HttpExceptionHandler implements IExceptionHandler {
  
    HandleException(status: number, msg: string, error?: any) {
      switch (status) {
        case 400:
          return this.BadRequest(msg, error);
        case 403:
          return this.Forbidden(msg, error)
        case 404:
          return this.NotFound(msg, error);
        case 500:
          return this.InternalServerError(msg, error);
        default:
          return this.InternalServerError(msg, error);
      }
    }
  
    private BadRequest(msg: string, error?: any): void {
      throw new BadRequestException(msg, error);
    }
  
    private NotFound(msg: string, error?: any): void {
      throw new NotFoundException(msg, error);
    }
  
    public Forbidden(msg: string, error?: any): void {
      throw new ForbiddenException(msg, error);
    }
  
    private InternalServerError(msg: string, error?: any): void {
      throw new InternalServerErrorException(msg, error);
    }
  }