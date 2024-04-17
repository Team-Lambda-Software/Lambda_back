import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
  } from '@nestjs/common';
  
  export class HttpResponseHandler {
  
    static HandleException(status: number, msg: string, error?: any) {
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
  
    private static BadRequest(msg: string, error?: any): void {
      throw new BadRequestException(msg, error);
    }
  
    private static NotFound(msg: string, error?: any): void {
      throw new NotFoundException(msg, error);
    }
  
    public static Forbidden(msg: string, error?: any): void {
      throw new ForbiddenException(msg, error);
    }
  
    private static InternalServerError(msg: string, error?: any): void {
      throw new InternalServerErrorException(msg, error);
    }
  }