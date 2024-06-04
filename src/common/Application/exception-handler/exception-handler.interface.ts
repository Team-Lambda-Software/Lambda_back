



export interface IExceptionHandler {
    HandleException(statusCode: number, message: string, error: Error): void
}