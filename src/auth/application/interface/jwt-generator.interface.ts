
export interface IJwtGenerator<T> {
    generateJwt (param: T): T
}