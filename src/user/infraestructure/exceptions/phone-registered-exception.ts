
export class PhoneRegisteredException extends Error {
    constructor () {
        super( 'Phone registered' )
        Object.setPrototypeOf(this, PhoneRegisteredException.prototype)
    }
}