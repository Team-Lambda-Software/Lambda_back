import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { Trainer } from "src/trainer/domain/trainer"



export class TrainerObjectMother {
     
    static async createNormalTrainer(){
        const idGenerator = new UuidGenerator()

        const normalTrainer = Trainer.create(await idGenerator.generateId(), 'John', 'Doe' , 'Doe', 'asfvs@gmail.com',
        '+58 123 123 123', [])

        return normalTrainer;
    }
}