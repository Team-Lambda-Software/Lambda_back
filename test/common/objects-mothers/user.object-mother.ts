/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "src/user/domain/user"
import { UserEmail } from "src/user/domain/value-objects/user-email"
import { UserId } from "src/user/domain/value-objects/user-id"
import { UserName } from "src/user/domain/value-objects/user-name"
import { UserPhone } from "src/user/domain/value-objects/user-phone"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { ReadModelObjectMother } from "./read-model.object-model"
import { Model } from "mongoose"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"
import { FileObjectMother } from "./file.object-mother"
import { UpdateUserProfileServiceEntryDto } from "src/user/application/dto/params/update-user-profile-service-entry.dto"
import { UpdateUserProfileInfraServiceEntryDto } from "src/user/infraestructure/services/dto/update-user-profile-infra-service-entry-dto"
import { UuidGeneratorMock } from "../other-mocks/uuid-generator.mock"


export class UserObjectMother {

    private readonly userModel: Model<OdmUserEntity>

    constructor(userModel: Model<OdmUserEntity>) {
        this.userModel = userModel
    }

    static async createNormalUser() {
        const idGenerator = new UuidGeneratorMock()

        const normalUser = User.create(
            UserId.create(await idGenerator.generateId()),
            UserName.create('John Doe Doe'),
            UserPhone.create('04120145852'),
            UserEmail.create('bKQkZ@example.com')
        )

        return normalUser;
    }

    static async createOrmUser() {
        const idGenerator = new UuidGeneratorMock()

        const normalOrmUser = OrmUser.create(
            await idGenerator.generateId(),
            'John Doe Doe',
            '04162235810',
            'bKQkZ@example.com',
            'example.txt',
            '"$2b$10$0kwGnnDmEJGmTg6O6u2QfOGBfd2QJ1PVJbdvpTJq7vn2KXaLu.1y6"',
            'CLIENT'
        )

        return normalOrmUser
    }

    async createOdmUser() {
        const idGenerator = new UuidGeneratorMock()

        const odmUser: OdmUserEntity = new this.userModel({
            id: await idGenerator.generateId(),
            name: 'John Doe Doe',
            email: 'example@gmail.com',
            password: 'asdlkjfldsj;lmasd',
            image: null,
            phone: '04166138440',
            type: 'CLIENT'
        })
        return odmUser
    }

    static async updateEntryValid(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "Luigi",
            email: "test@gmail.com",
            phone: "04126138440",
        }
    }

    static async updateEntryInvalidName(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "L",
            email: "test@gmail.com",
            phone: "04126138440",
        }
    }

    static async updateEntryInvalidEmail(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "Luigi",
            email: "email",
            phone: "04126138440",
        }
    }

    static async updateEntryInvalidPhone(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "Luigi",
            email: "email",
            phone: "+58 123",
        }
    }

    static async updateInfraEntryValid(id: string): Promise<UpdateUserProfileInfraServiceEntryDto>{
        return {
            userId: id,
            password: 'hola2024',
            image: await FileObjectMother.createFile(),
        }
    }

}