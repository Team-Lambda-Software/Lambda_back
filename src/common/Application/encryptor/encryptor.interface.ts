
export interface IEncryptor {
    hashPassword(planePassword: string): Promise<string>
    comparePlaneAndHash(planePassword: string, hashPassword: string): Promise<boolean>
}