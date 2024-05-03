import { ProgressTracker } from "./progress-tracker"
import { Entity } from "src/common/Domain/domain-object/entity.interface"

export abstract class TrackableEntity<T> extends Entity<T>
{
    private _trackers:Map<T, ProgressTracker<T>>;
    
    protected constructor (id:T)
    {
        super(id);
        this._trackers = new Map<T, ProgressTracker<T>>();
    }

    subscribe(s:ProgressTracker<T>):void 
    {
        this._trackers.set(s.Id, s);
    }
    unsubscribe(s:ProgressTracker<T>):void
    {
        this._trackers.delete(s.Id);
    }
    notify():void
    {
        for (let tracker of this._trackers)
        {
            tracker[1].update(this.Id);
        }
    }
}