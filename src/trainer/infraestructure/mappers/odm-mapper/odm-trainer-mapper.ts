import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { Trainer } from "src/trainer/domain/trainer";
import { OdmTrainerEntity } from "../../entities/odm-entities/odm-trainer.entity";
import { UserId } from "src/user/domain/value-objects/user-id";
import { TrainerLocation } from "src/trainer/domain/value-objects/trainer-location";
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id";
import { TrainerName } from "src/trainer/domain/value-objects/trainer-name";
import { TrainerEmail } from "src/trainer/domain/value-objects/trainer-email";
import { TrainerPhone } from "src/trainer/domain/value-objects/trainer-phone";
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers";

export class OdmTrainerMapper implements IMapper<Trainer, OdmTrainerEntity>
{
    fromDomainToPersistence(domain: Trainer): Promise<OdmTrainerEntity> {
        throw new Error( "Method not yet implemented" ); //to-do Will be required by admin application
    }

    async fromPersistenceToDomain(persistence: OdmTrainerEntity): Promise<Trainer> {
        let domainFollowers:UserId[] = [];

        if (persistence.followers)
        {
            for (let user of persistence.followers)
            {
                domainFollowers.push(UserId.create(user.id))
            }
        }

        let trainerLocation: TrainerLocation | undefined = undefined;
        if ( (persistence.latitude)&&(persistence.latitude) ) { trainerLocation = TrainerLocation.create(parseFloat(persistence.latitude), parseFloat(persistence.longitude)); }
        const domainTrainer = Trainer.create(TrainerId.create(persistence.id), TrainerName.create(persistence.first_name, persistence.first_last_name, persistence.second_last_name), TrainerEmail.create(persistence.email), TrainerPhone.create(persistence.phone), TrainerFollowers.create(domainFollowers), trainerLocation);
        return domainTrainer;
    }
}