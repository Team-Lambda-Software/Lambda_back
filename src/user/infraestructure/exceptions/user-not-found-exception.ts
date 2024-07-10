
export class UserNotFoundException extends Error {
    constructor () {
        super( 'User not found' )
        Object.setPrototypeOf(this, UserNotFoundException.prototype)
    }
}