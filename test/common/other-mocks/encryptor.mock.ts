/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEncryptor } from "src/common/Application/encryptor/encryptor.interface";

export class EncryptorBcryptMock implements IEncryptor{
    async hashPassword(planePassword: string): Promise<string> {
        return "$2b$10$0kwGnnDmEJGmTg6O6u2QfOGBfd2QJ1PVJbdvpTJq7vn2KXaLu.1y6"
    }
    
    async comparePlaneAndHash(planePassword: string, hashPassword: string): Promise<boolean> {
        return planePassword === hashPassword
    }
    
}