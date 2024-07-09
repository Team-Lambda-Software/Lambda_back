import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { TrainerId } from 'src/trainer/domain/value-objects/trainer-id'


export class CourseTrainer implements IValueObject<CourseTrainer>{
    
    private readonly id: TrainerId
    
    get Value(){ return this.id.Value }

    protected constructor ( id: TrainerId ){
        this.id = id
    }

    equals ( valueObject: CourseTrainer ): boolean
    {
        return this.id.equals(valueObject.id)
    }

    static create (id: TrainerId){
        return new CourseTrainer(id)
    }

}