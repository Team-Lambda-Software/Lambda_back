import { DomainEvent } from "src/common/Domain/domain-event/domain-event"



export interface IEventSubscriber {

    unsubscribe: () => void

}