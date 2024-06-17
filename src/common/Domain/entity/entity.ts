import { IValueObject } from "../value-object/value-object.interface"



export abstract class Entity < T extends IValueObject<T>>{
    private id: T

    protected constructor ( id: T ){
        this.id = id
    }

    get Id (): T {
        return this.id
    }

    equals ( id: T ): boolean {
        return this.id.equals( id )
    }
}