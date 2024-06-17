import { Result } from "../../Domain/result-handler/Result";
import { PushNotificationDto } from "./dto/token-notification.dto";

export interface INotifier {
    sendNotification( message: PushNotificationDto ): Promise<Result<string>> 
}
