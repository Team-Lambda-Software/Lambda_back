import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { Trainer } from "src/trainer/domain/trainer"
import { TrainerEmail } from "src/trainer/domain/value-objects/trainer-email"
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { TrainerLocation } from "src/trainer/domain/value-objects/trainer-location"
import { TrainerName } from "src/trainer/domain/value-objects/trainer-name"
import { TrainerPhone } from "src/trainer/domain/value-objects/trainer-phone"



export class TrainerObjectMother {
     
    static async createNormalTrainer(){
        const idGenerator = new UuidGenerator()

        const normalTrainer = Trainer.create(TrainerId.create(await idGenerator.generateId()), TrainerName.create('john', 'doe', 'doe'),
    TrainerEmail.create('example@gmail.com'), TrainerPhone.create('04242176479'), TrainerFollowers.create([]))

        return normalTrainer;
    }
}