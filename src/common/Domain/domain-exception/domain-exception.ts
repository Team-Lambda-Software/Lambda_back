


export abstract class DomainException extends Error {
    constructor ( message: string ) {
        super( message )
        Object.setPrototypeOf(this, DomainException.prototype)
    }
}