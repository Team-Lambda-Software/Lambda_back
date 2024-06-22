import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { User } from "src/user/domain/user"
import { UserEmail } from "src/user/domain/value-objects/user-email"
import { UserId } from "src/user/domain/value-objects/user-id"
import { UserName } from "src/user/domain/value-objects/user-name"
import { UserPhone } from "src/user/domain/value-objects/user-phone"


export class UserObjectMother {
     
    static async createNormalUser(){
        const idGenerator = new UuidGenerator()

        const normalUser = User.create(
            UserId.create(await idGenerator.generateId()), 
            UserName.create('John Doe Doe'),
            UserPhone.create('+58 123 123 123'),
            UserEmail.create('bKQkZ@example.com')
        )
        
        return normalUser;
    }
}