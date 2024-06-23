import * as bcrypt from 'bcrypt'
import { IEncryptor } from 'src/common/Application/encryptor/encryptor.interface'

export class EncryptorBcrypt implements IEncryptor {
    constructor() {}
    async hashPassword(planePassword: string): Promise<string> {
        return bcrypt.hash(planePassword, 10)
    }
    async comparePlaneAndHash(planePassword: string, hashPassword: string): Promise<boolean> {
        return bcrypt.compare(planePassword, hashPassword)
    }
}