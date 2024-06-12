import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { Trainer } from "src/trainer/domain/trainer";
import { OrmTrainer } from "../../entities/orm-entities/trainer.entity";

export class OrmTrainerMapper implements IMapper<Trainer, OrmTrainer>
{
    async fromDomainToPersistence(domain: Trainer): Promise<OrmTrainer> {
        throw new Error("Method not implemented"); //to-do this will be needed for the administrative application
    }

    async fromPersistenceToDomain(persistence: OrmTrainer): Promise<Trainer> {
        let followersID:Array<string> = new Array<string>();
        //. Same motive as below
            // let coursesID:Array<string> = new Array<string>();
            // let blogsID:Array<string> = new Array<string>();
        if (persistence.followers)
        {
            for (let user of persistence.followers)
            {
                followersID.push(user.id);
            }
        }
        //unused For easier DDD, the relationship with courses and blogs was removed from the domain's representation of Trainer
            // if (persistence.courses)
            // {
            //     for (let course of persistence.courses)
            //     {
            //         coursesID.push(course.trainer_id);
            //     }
            // }
            // if (persistence.blogs)
            // {
            //     for (let blog of persistence.blogs)
            //     {
            //         blogsID.push(blog.trainer_id);
            //     }
            // }
        const domainTrainer = Trainer.create(persistence.id, persistence.first_name, persistence.first_last_name, persistence.second_last_name, persistence.email, persistence.phone, followersID, persistence.latitude, persistence.longitude);
        return domainTrainer;
    }
}