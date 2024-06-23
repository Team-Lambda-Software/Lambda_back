import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface"
import { IEventSubscriber } from "src/common/Application/event-handler/subscriber.interface"
import { DomainEvent } from "src/common/Domain/domain-event/domain-event"


export class EventHandlerMock implements IEventHandler{
    async publish ( events: DomainEvent[] ): Promise<void>
    {
        
    }
    subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void> ): Promise<IEventSubscriber>
    {
        throw new Error( "Method not implemented." )
    }

}