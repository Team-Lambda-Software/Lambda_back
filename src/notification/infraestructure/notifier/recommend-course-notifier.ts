import * as admin from 'firebase-admin';
import { TokenNotification } from 'src/common/Application/notifier/dto/token-notification.dto';
import { INotifier } from 'src/common/Application/notifier/notifier.application';
import { Result } from 'src/common/Application/result-handler/Result';
import { Course } from 'src/course/domain/course';

export class RecommendCourseNotifier implements INotifier<Course> {
    variable: Course = null
    setVariable(variable: Course): void { this.variable = variable }
    async sendNotification(data: TokenNotification): Promise<Result<string>> {
        let err = false
        if ( !this.variable ) 
            return Result.fail(new Error('Error al enviar notificacion'), 500, 'Error al enviar notificacion')
        const message = { 
            notification: { title: "Recomendación del día!", 
                body: 'Te recomendamos personalmente el curso de ' + this.variable.Name
            }, 
            token: data.token
        }
        try { const res = await admin.messaging().send(message)
        } catch(e) { err = true } 
        if ( !err ) return Result.success<string>('mensaje enviado', 200)
        return Result.fail<string>(new Error('error enviando token'), 500, 'error enviando push')
        
    }
} 