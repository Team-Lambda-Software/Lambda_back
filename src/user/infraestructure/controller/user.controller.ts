/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrmUserRepository } from '../repositories/orm-repositories/orm-user-repository';
import { DataSource } from 'typeorm';
import { OrmUserMapper } from '../mappers/orm-mapper/orm-user-mapper';
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { userUpdateEntryInfraestructureDto } from '../dto/entry/user-update-entry-infraestructure';
import { UpdateUserProfileAplicationService } from "src/user/application/services/command/update-user-profile.application.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/user/domain/user";
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { FollowTrainerUserApplicationService } from "src/user/application/services/command/follow-trainer-user.application.service";
import { UnfollowTrainerUserApplicationService } from "src/user/application/services/command/unfollow-trainer-user.application.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { UpdateUserProfileSwaggerResponseDto } from "src/user/infraestructure/dto/response/update-user-profile-swagger-response.dto";
import { FolloUnfollowSwaggerResponseDto } from "../dto/response/follow-unfollow-entry-swagger-response.dto";
import { GetUserSwaggerResponseDto } from "../dto/response/get-user-swagger-response.dto";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
import { OrmProgressCourseRepository } from "src/progress/infraestructure/repositories/orm-repositories/orm-progress-course-repository"
import { OrmProgressCourseMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-course-mapper"
import { OrmProgressSectionMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-section-mapper"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { UpdateUserProfileServiceEntryDto } from "src/user/application/dto/params/update-user-profile-service-entry.dto"
import { ImageTransformer } from "src/common/Infraestructure/image-helper/image-transformer"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { AzureFileUploader } from "src/common/Infraestructure/azure-file-uploader/azure-file-uploader"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { IInfraUserRepository } from "../../application/interfaces/orm-infra-user-repository.interface";
import { OrmInfraUserRepository } from "../repositories/orm-repositories/orm-infra-user-repository";
import { OrmAuditingRepository } from 'src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository';
import { AuditingDecorator } from 'src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator';
import { IEncryptor } from 'src/common/Application/encryptor/encryptor.interface';
import { EncryptorBcrypt } from 'src/common/Infraestructure/encryptor/encryptor-bcrypt';
import { InfraUserQuerySynchronizer } from '../query-synchronizer/user-infra-query-synchronizer';
import { UserQueryRepository } from '../repositories/user-query-repository.interface';
import { OdmUserRepository } from '../repositories/odm-repository/odm-user-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OdmUserEntity } from '../entities/odm-entities/odm-user.entity';
import { RabbitEventBus } from 'src/common/Infraestructure/rabbit-event-bus/rabbit-event-bus';
import { OdmUserMapper } from '../mappers/odm-mappers/odm-user-mapper';
import { OrmUser } from '../entities/orm-entities/user.entity';
import { UserEmailModified } from 'src/user/domain/events/user-email-modified-event';
import { UserQuerySynchronizer } from '../query-synchronizer/user-query-synchronizer';
import { UpdateUserProfileInfraService } from '../services/update-user-profile-infra.service';
import { UpdateUserProfileInfraServiceEntryDto } from '../services/dto/update-user-profile-infra-service-entry-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserNameModified } from 'src/user/domain/events/user-name-modified-event';
import { UserPhoneModified } from 'src/user/domain/events/user-phone-modified-event';


@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly odmUserRepository: OdmUserRepository
  private readonly userRepository: OrmUserRepository
  private readonly trainerRepository: OrmTrainerRepository
  private readonly logger: Logger = new Logger("UserController")
  private readonly imageTransformer: ImageTransformer
  private readonly idGenerator: IdGenerator<string>
  private readonly fileUploader: AzureFileUploader
  private readonly infraUserRepository: IInfraUserRepository;
  private readonly auditingRepository: OrmAuditingRepository;
  private readonly encryptor: IEncryptor
  //private readonly queryUserRepository: UserQueryRepository
  private readonly infraUserQuerySyncronizer: InfraUserQuerySynchronizer
  private readonly userQuerySyncronizer: UserQuerySynchronizer

  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    @InjectModel('User') private userModel: Model<OdmUserEntity>
  ) {
    this.odmUserRepository = new OdmUserRepository(userModel)
    //this.queryUserRepository = new OdmUserRepository(userModel)
    this.encryptor = new EncryptorBcrypt()
    this.infraUserRepository = new OrmInfraUserRepository(dataSource)
    this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
    this.trainerRepository = new OrmTrainerRepository(new OrmTrainerMapper(), dataSource)
    this.imageTransformer = new ImageTransformer()
    this.idGenerator = new UuidGenerator()
    this.fileUploader = new AzureFileUploader()
    this.auditingRepository = new OrmAuditingRepository(dataSource)
    this.infraUserQuerySyncronizer = new InfraUserQuerySynchronizer(this.odmUserRepository, userModel)
    this.userQuerySyncronizer = new UserQuerySynchronizer(this.odmUserRepository, userModel)
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description:
      'Modificar dato/s de registro de un usuario, dado el id del usuario',
    type: UpdateUserProfileSwaggerResponseDto,
  })
  async updateUser(@GetUser() user, @Body() updateEntryDTO: userUpdateEntryInfraestructureDto) {
    const eventBus = RabbitEventBus.getInstance()
    let image: File = null

    if (updateEntryDTO.image) {
      image = await this.imageTransformer.base64ToFile(updateEntryDTO.image)
    }

    const userUpdateDto: UpdateUserProfileServiceEntryDto = { userId: user.id, ...updateEntryDTO }

    const updateUserProfileService = new AuditingDecorator(
      new ExceptionDecorator(
        new LoggingDecorator(
          new UpdateUserProfileAplicationService(
            this.userRepository,
            eventBus
          ),
          new NativeLogger(this.logger),
        ),
        new HttpExceptionHandler(),
      ),
      this.auditingRepository,
      this.idGenerator,
    );

    const resultUpdate = (await updateUserProfileService.execute(userUpdateDto))

    if (updateEntryDTO.email) {
      eventBus.subscribe('UserEmailModified', async (event: UserEmailModified) => {
        this.userQuerySyncronizer.execute(event)
      })
    }

    if (updateEntryDTO.name) {
      eventBus.subscribe('UserNameModified', async (event: UserNameModified) => {
        this.userQuerySyncronizer.execute(event)
      })
    }

    if (updateEntryDTO.phone) {
      eventBus.subscribe('UserPhoneModified', async (event: UserPhoneModified) => {
        this.userQuerySyncronizer.execute(event);
      })
    }

    if (!resultUpdate.isSuccess()) {
      return resultUpdate.Error
    }

    const updateUserProfileInfraService =
      new AuditingDecorator(
        new ExceptionDecorator(
          new LoggingDecorator(
            new UpdateUserProfileInfraService(
              this.infraUserRepository,
              this.infraUserQuerySyncronizer,
              this.idGenerator,
              this.encryptor,
              this.fileUploader
            ),
            new NativeLogger(this.logger),
          ),
          new HttpExceptionHandler(),
        ),
        this.auditingRepository,
        this.idGenerator
      );

    if (updateEntryDTO.password || updateEntryDTO.image) {
      const userInfraUpdateDto: UpdateUserProfileInfraServiceEntryDto = {
        userId: user.id,
        password: updateEntryDTO.password,
        image: image
      }

      const updateInfraResult = await updateUserProfileInfraService.execute(userInfraUpdateDto)

      if (!updateInfraResult.isSuccess)
        return updateInfraResult.Error

      const Respuesta: UpdateUserProfileSwaggerResponseDto = {
        Id: updateInfraResult.Value.userId
      }

      return Respuesta
    }

    const respuesta: UpdateUserProfileSwaggerResponseDto = {
      Id: resultUpdate.Value.userId
    }
    return respuesta
  }


}
