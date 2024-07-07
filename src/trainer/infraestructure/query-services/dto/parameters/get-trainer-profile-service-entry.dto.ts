import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";

export interface GetTrainerProfileServiceEntryDto extends ApplicationServiceEntryDto {
    trainerId:string;
    //unused Common API specification does not consider this
        // coursesPagination:PaginationDto;
        // blogsPagination:PaginationDto;
}