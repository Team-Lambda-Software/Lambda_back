import { Controller, Get, Inject, Logger, Param, Post } from "@nestjs/common"
import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository"
import { DataSource, EntityManager, In } from "typeorm"
import { User } from "src/user/domain/user"
import { OrmUserMapper } from '../mappers/orm-mapper/orm-user-mapper';
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { GetUserProfileApplicationService } from "src/user/application/services/get-user-profile.application.service"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"



@Controller('user')
export class UserController {

    private readonly userRepository: OrmUserRepository
    //this will be made in the services, but for tests purposes we will use it here
    private readonly uuidGenerator: IdGenerator<string>

    private readonly logger: Logger = new Logger( "UserController" )
    constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
        
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this.uuidGenerator = new UuidGenerator()

    }

    @Post()
    async saveUser() {
        const user = User.create(await this.uuidGenerator.generateId(), 'name', 'lastname', 'lastname', 'email', 'password')
        return await this.userRepository.saveUserAggregate(user)
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        
        const getUserProfileService = new ExceptionDecorator(new LoggingDecorator(new GetUserProfileApplicationService(this.userRepository), new NativeLogger(this.logger)))
        return (await getUserProfileService.execute({userId: id})).Value
        
    }
}