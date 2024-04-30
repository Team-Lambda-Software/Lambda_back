import { ApplicationServiceResponseDto } from "src/common/Application/application-services/dto/application-service-response.dto";

export class LogInResponseApplicationDto implements ApplicationServiceResponseDto {
    userId: string
    token: string
}