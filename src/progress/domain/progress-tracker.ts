import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { TrackableEntity } from "./trackable-entity"

export abstract class ProgressTracker<T> extends Entity<T>
{
    private notifierId:T;

    protected constructor (id:T, objective:TrackableEntity<T>)
    {
        super (id);
        objective.subscribe(this);
    }

    //What to do once observed object notifies that section is complete
    abstract update(notifierId:T):void;
    //Is this element fully complete?
    abstract get IsComplete(): boolean;
    //Returns current completion percent of element as number (0~100)
    abstract get CompletionPercent(): number;
    //Returns a Map with correlation between item ID and completion state
    abstract get CompletionMap():Map<T,boolean>;
}