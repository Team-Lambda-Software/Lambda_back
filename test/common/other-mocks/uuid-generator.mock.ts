import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"



export class UuidGeneratorMock implements IdGenerator<string> {
    async generateId(): Promise<string> {
        return 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'
    }
}