


export abstract class DomainEvent{
    private ocurredOn: Date

    constructor(){
        this.ocurredOn = new Date()
    }

    get OcurredOn(): Date{
        return this.ocurredOn
    }

    get eventName(): string{
        return this.constructor.name
    }
}