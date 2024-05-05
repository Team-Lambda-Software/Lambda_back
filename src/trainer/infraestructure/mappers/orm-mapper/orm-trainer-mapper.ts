import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { Trainer } from "src/trainer/domain/trainer";
import { OrmTrainer } from "../../entities/orm-entities/trainer.entity";

export class OrmTrainerMapper implements IMapper<Trainer, OrmTrainer>
{
    async fromDomainToPersistence(domain: Trainer): Promise<OrmTrainer> {
        throw new Error("Method not implemented"); //! Why is this like this?
    }

    async fromPersistenceToDomain(persistence: OrmTrainer): Promise<Trainer> {
        let followersID:Array<string> = new Array<string>();
        let coursesID:Array<string> = new Array<string>();
        let blogsID:Array<string> = new Array<string>();
        for (let user of persistence.followers)
        {
            followersID.push(user.id);
        }
        for (let course of persistence.courses)
        {
            coursesID.push(course.trainer_id);
        }
        for (let blog of persistence.blogs)
        {
            blogsID.push(blog.trainer_id);
        }
        const domainTrainer = Trainer.create(persistence.id, persistence.first_name, persistence.first_last_name, persistence.second_last_name, persistence.email, persistence.phone, followersID, coursesID, blogsID, persistence.location);
        return domainTrainer;
    }
}