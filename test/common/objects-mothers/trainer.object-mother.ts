import { Model } from "mongoose"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { Trainer } from "src/trainer/domain/trainer"
import { TrainerEmail } from "src/trainer/domain/value-objects/trainer-email"
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { TrainerLocation } from "src/trainer/domain/value-objects/trainer-location"
import { TrainerName } from "src/trainer/domain/value-objects/trainer-name"
import { TrainerPhone } from "src/trainer/domain/value-objects/trainer-phone"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"



export class TrainerObjectMother {
     
    private readonly trainerModel: Model<OdmTrainerEntity>
    constructor ( trainerModel: Model<OdmTrainerEntity> ){
        this.trainerModel = trainerModel
    }
    static async createNormalTrainer(){
        const idGenerator = new UuidGenerator()

        const normalTrainer = Trainer.create(TrainerId.create(await idGenerator.generateId()), TrainerName.create('john', 'doe', 'doe'),
    TrainerEmail.create('example@gmail.com'), TrainerPhone.create('04242176479'), TrainerFollowers.create([]))

        return normalTrainer;
    }

    async createOdmTrainer (){
        return new this.trainerModel({
            id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7', 
            first_name: 'john', 
            first_last_name: 'doe', 
            second_last_name: 'doe', 
            email: 'example@gmail.com', 
            phone: '04166138440', 
            latitude: '10.0000', 
            longitude: '10.0000', 
            followers: []})
    }


}