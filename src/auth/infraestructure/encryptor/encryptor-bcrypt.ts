import { IEncryptor } from "src/auth/application/interface/encryptor.interface";
import * as bcrypt from 'bcrypt'

export class EncryptorBcrypt implements IEncryptor {
    constructor() {}
    async hashPassword(planePassword: string): Promise<string> {
        return bcrypt.hash(planePassword, 10)
    }
    async comparePlaneAndHash(planePassword: string, hashPassword: string): Promise<boolean> {
        throw bcrypt.compare(planePassword, hashPassword)
    }
}