import { IMapper } from 'src/common/Application/mapper/mapper.interface';
import { Trainer } from 'src/trainer/domain/trainer';
import { OrmTrainer } from '../../entities/orm-entities/trainer.entity';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { TrainerId } from 'src/trainer/domain/value-objects/trainer-id';
import { TrainerName } from 'src/trainer/domain/value-objects/trainer-name';
import { TrainerEmail } from 'src/trainer/domain/value-objects/trainer-email';
import { TrainerPhone } from 'src/trainer/domain/value-objects/trainer-phone';
import { TrainerFollowers } from 'src/trainer/domain/value-objects/trainer-followers';
import { TrainerLocation } from 'src/trainer/domain/value-objects/trainer-location';

export class OrmTrainerMapper implements IMapper<Trainer, OrmTrainer> {
  async fromDomainToPersistence(domain: Trainer): Promise<OrmTrainer> {
    const lat = domain.Location.Latitude
      ? domain.Location.Latitude.toString()
      : null;
    const long = domain.Location.Longitude
      ? domain.Location.Longitude.toString()
      : null;
    const trainer: OrmTrainer = OrmTrainer.create(
      domain.Id.Value,
      domain.Name.FirstName,
      domain.Name.FirstLastName,
      domain.Name.SecondLastName,
      domain.Email.Value,
      domain.Phone.Value,
      lat,
      long,
      [],
      [],
      [],
    );
    return trainer;
  }

  async fromPersistenceToDomain(persistence: OrmTrainer): Promise<Trainer> {
    let domainFollowers: Array<UserId> = new Array<UserId>();
    //. Same motive as below
    // let coursesID:Array<string> = new Array<string>();
    // let blogsID:Array<string> = new Array<string>();
    if (persistence.followers) {
      for (let user of persistence.followers) {
        domainFollowers.push(UserId.create(user.id));
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
    let trainerLocation: TrainerLocation | undefined = undefined;
    if (persistence.latitude && persistence.longitude) {
      trainerLocation = TrainerLocation.create(
        parseFloat(persistence.latitude),
        parseFloat(persistence.longitude),
      );
    }
    const domainTrainer = Trainer.create(
      TrainerId.create(persistence.id),
      TrainerName.create(
        persistence.first_name,
        persistence.first_last_name,
        persistence.second_last_name,
      ),
      TrainerEmail.create(persistence.email),
      TrainerPhone.create(persistence.phone),
      TrainerFollowers.create(domainFollowers),
      trainerLocation,
    );
    return domainTrainer;
  }
}
