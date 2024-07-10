
export class IncorrectPasswordException extends Error {
    constructor () {
        super( 'Incorrect Password' )
        Object.setPrototypeOf(this, IncorrectPasswordException.prototype)
    }
}