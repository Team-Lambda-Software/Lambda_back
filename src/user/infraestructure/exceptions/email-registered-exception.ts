
export class EmailRegisteredException extends Error {
    constructor () {
        super( 'Email registered' )
        Object.setPrototypeOf(this, EmailRegisteredException.prototype)
    }
}