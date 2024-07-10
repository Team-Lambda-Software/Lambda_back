import { Model } from "mongoose"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmNotificationAlertEntity } from "../entities/odm-entities/odm-notification-alert.entity"
import { INotificationAlertRepository, NotiAlert } from "./interface/notification-alert-repository.interface"

export class OdmNotificationAlertRepository implements INotificationAlertRepository {

    private readonly notiModel: Model<OdmNotificationAlertEntity>
    constructor ( notiModel: Model<OdmNotificationAlertEntity>) {
        this.notiModel = notiModel
    }

    async deleteNotificationsByUser(user_id: string) {
        try {
            await this.notiModel.deleteMany( { "user_id": user_id } )
        } catch(error) {
            return Result.fail<OdmNotificationAlertEntity[]>( error, 500, "Error al eliminar notificaciones" )
        }
    }
    
    async findManyNotificationsByIdUser(userId: string, pagDto: PaginationDto): Promise<Result<OdmNotificationAlertEntity[]>> {
        try {
            const {page, perPage} = pagDto
            const noti = await this.notiModel.find( { "user_id": userId } ).skip(page).limit(perPage)
            return Result.success<OdmNotificationAlertEntity[]>( noti, 200 )
        } catch (error) {
            return Result.fail<OdmNotificationAlertEntity[]>( error, 500, "Error buscando Notificaciones" )
        }
    }
    
    async saveNotificationAlert( data: NotiAlert ) {
        const noti = new this.notiModel(data)
        await this.notiModel.create( noti )
    }
    
    async findNotificationById(user_id: string, notification_id: string): Promise<Result<OdmNotificationAlertEntity>> {
        try {
            const noti = await this.notiModel.findOne( { "user_id": user_id, "alert_id": notification_id } )
            return Result.success<OdmNotificationAlertEntity>( noti, 200 )
        } catch (error) {
            return Result.fail<OdmNotificationAlertEntity>( error, 500, "Error buscando Notificacion" )
        }
    }
    
    async findAllByIdUserNotReaded(user_id: string): Promise<Result<OdmNotificationAlertEntity[]>> {
        try {
            const noti = await this.notiModel.find( { "user_id": user_id, "user_readed": false } )
            return Result.success<OdmNotificationAlertEntity[]>( noti, 200 )
        } catch (error) {
            return Result.fail<OdmNotificationAlertEntity[]>( error, 500, "Error buscando Notificaciones" )
        }
    }

}