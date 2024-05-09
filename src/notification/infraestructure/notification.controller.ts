import { Controller } from "@nestjs/common";
import { Get } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { SendPushNotificationService } from "../application/send-push-notification-a-user.service";
import { FirebaseService } from '../application/firebase.service';
@Controller('notification')
export class NotificationController {
    private tokenUsers = []
  constructor(
    private firebaseService: FirebaseService,
    private sendPushNotificationService: SendPushNotificationService
  ) {}

  @Get('notify')
  async sendNotification() {
    await this.sendPushNotificationService.execute(this.tokenUsers, 'Es un gran dia para hacer ejercicio');
  }
}