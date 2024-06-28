import { Result } from "../../Domain/result-handler/Result";
import { PushMulticastDto, PushNotificationDto } from "./dto/token-notification.dto";

export interface IPushSender {
    sendNotificationPush( message: PushNotificationDto ): Promise<Result<string>> 
    sendMulticastPush( message: PushMulticastDto ): Promise<void> 
}
