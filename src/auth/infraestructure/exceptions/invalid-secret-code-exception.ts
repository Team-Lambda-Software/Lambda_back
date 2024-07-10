
export class InvalidSecretCodeException extends Error {
    constructor () {
        super( 'Invalid secret code' )
        Object.setPrototypeOf(this, InvalidSecretCodeException.prototype)
    }
}