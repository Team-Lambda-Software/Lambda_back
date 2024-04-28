import { Controller, Inject, Post } from "@nestjs/common"
import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository"
import { DataSource, EntityManager, In } from "typeorm"
import { User } from "src/user/domain/user"
import { OrmUserMapper } from '../mappers/orm-mapper/orm-user-mapper';
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"



@Controller('user')
export class UserController {

    private readonly userRepository: OrmUserRepository
    //this will be made in the services, but for tests purposes we will use it here
    private readonly uuidGenerator: IdGenerator<string>
    constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
        
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this.uuidGenerator = new UuidGenerator()

    }

    @Post()
    async saveUser() {
        const user = User.create(await this.uuidGenerator.generateId(), 'name', 'lastname', 'lastname', 'email', 'password')
        return await this.userRepository.saveUserAggregate(user)
    }
}