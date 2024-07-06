import { DomainEvent } from "src/common/Domain/domain-event/domain-event";


export class TrainerCreated extends DomainEvent {
    protected constructor (
        public id: string,
        public name: {firstName: string, firstLastName: string, secondLastName: string},
        public email: string,
        public phone: string,
        public followers: string[],
        public location?: {longitude: number, latitude: number}
        )
    {
        super();
    }

    static create (id: string, name:{firstName: string, firstLastName: string, secondLastName: string}, email:string, phone:string, followers: string[], location?: {longitude: number, latitude: number}): TrainerCreated
    {
        return new TrainerCreated( id, name, email, phone, followers, location);
    }
}