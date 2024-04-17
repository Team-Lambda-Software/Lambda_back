

export abstract class Entity <T> {

    id: T

    constructor (id: T) {
        this.id = id
    }

    get Id (): T {
        return this.id
    }

    equals (entity: Entity<T>): boolean {
        return this.id === entity.id //por ahora suponemos que el id solo puede tener tipos primitivos
    }

}