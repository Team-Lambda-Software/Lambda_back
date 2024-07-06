/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { User } from "src/user/domain/user"
import { UserEmail } from "src/user/domain/value-objects/user-email"
import { UserId } from "src/user/domain/value-objects/user-id"
import { UserName } from "src/user/domain/value-objects/user-name"
import { UserPhone } from "src/user/domain/value-objects/user-phone"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { ReadModelObjectMother } from "./read-model.object-model"
import { Model } from "mongoose"


export class UserObjectMother {
    
    private userModel: Model<OdmUserEntity>
    constructor(userModel: Model<OdmUserEntity>){
        this.userModel = userModel
        
    }
    static async createNormalUser(){
        const idGenerator = new UuidGenerator()
        
        const normalUser = User.create(
            UserId.create(await idGenerator.generateId()), 
            UserName.create('John Doe Doe'),
            UserPhone.create('+58 123 123'),
            UserEmail.create('bKQkZ@example.com')
        )
        
        return normalUser;
    }

    async createOdmUser(){
        const idGenerator = new UuidGenerator()

        
        const odmUser: OdmUserEntity = new this.userModel({
            id: await idGenerator.generateId(),
            name: 'john doe doe',
            email: 'example@gmail.com',
            password: 'asdlkjfldsj;lmasd',
            image: null,
            phone: '04166138440',
            type: 'CLIENT'
        })
        return odmUser
    }
}