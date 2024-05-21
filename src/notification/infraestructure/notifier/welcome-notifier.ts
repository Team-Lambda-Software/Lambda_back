import * as admin from 'firebase-admin';
import { TokenNotification } from 'src/common/Application/notifier/dto/token-notification.dto';
import { INotifier } from 'src/common/Application/notifier/notifier.application';
import { Result } from 'src/common/Domain/result-handler/Result';

export class WelcomeNotifier implements INotifier<string> {    
    variable: string = 'none'
    setVariable(variable: string): void { this.variable = variable }
    async sendNotification(data: TokenNotification): Promise<Result<string>> {
        let err = false
        const message = { 
            notification: { title: "Welcome", body: 'be Welcome my dear'+ this.variable }, 
            token: data.token
        }
        try { const res = await admin.messaging().send(message)
        } catch(e) { err = true } 
        if ( !err ) return Result.success<string>('mensaje enviado', 200)
        return Result.fail<string>(new Error('error enviando token'), 500, 'error enviando push')
        
    }
} 