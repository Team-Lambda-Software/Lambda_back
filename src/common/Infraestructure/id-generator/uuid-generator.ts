import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { v4 as uuidv4 } from 'uuid'


export class UuidGenerator implements IdGenerator<string> {
    async generateId(): Promise<string> {
        return uuidv4()
    }
}