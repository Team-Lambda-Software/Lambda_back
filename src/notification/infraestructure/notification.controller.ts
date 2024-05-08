import { Controller } from "@nestjs/common";
import { Get } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { SendPushNotificationService } from "../application/send-push-notification-a-user.service";

@Controller('notification')
export class NotificationController {
 
    private tokenUsers = []

    @Get('notify')
    async sendNotification() {
        
        const pushService = new SendPushNotificationService()
        
        pushService.execute()

    }

}