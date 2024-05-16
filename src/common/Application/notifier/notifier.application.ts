import { Result } from "../result-handler/Result";
import { TokenNotification } from "./dto/token-notification.dto";

export interface INotifier<T> {
    variable: T
    sendNotification( message: TokenNotification ): Promise<Result<string>> 
    setVariable( variable: T ): void 
}
