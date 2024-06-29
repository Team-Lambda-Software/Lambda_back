import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { Trainer } from "src/trainer/domain/trainer";

export interface TogggleTrainerFollowServiceEntryDto extends ApplicationServiceEntryDto {
    trainer: Trainer
}