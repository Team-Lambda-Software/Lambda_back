import { Result } from "../result-handler/Result";
import { TokenNotification } from "./dto/token-notification.dto";

export abstract class INotifier<T> {
    variable: T
    abstract sendNotification( message: TokenNotification ): Promise<Result<string>> 
    abstract setVariable( variable: T ): void 
}
