import * as admin from 'firebase-admin';
import { PushNotificationDto } from 'src/common/Application/notifier/dto/token-notification.dto';
import { INotifier } from 'src/common/Application/notifier/notifier.application';
import { Result } from 'src/common/Application/result-handler/Result';

export class FirebaseNotifier implements INotifier {

    private static instance: FirebaseNotifier

    private constructor() {
        const credentials:object = {
            type: process.env.FB_TYPE,
            project_id: process.env.FB_PROJECT_ID,
            private_key_id: process.env.FB_PRIVATE_KEY_ID,
            private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/gm, "\n"),            
            client_email: process.env.FB_CLIENT_EMAIL,
            client_id: process.env.FB_CLIENT_ID,
            auth_uri: process.env.FB_AUTH_URI,
            token_uri: process.env.FB_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER,
            client_x509_cert_url: process.env.FB_CLIENT,
            universe_domain: process.env.FB_DOMAIN
        }        
        admin.initializeApp({ credential: admin.credential.cert(credentials) })
    }

    public static getInstance(): FirebaseNotifier {
        if (!FirebaseNotifier.instance) FirebaseNotifier.instance = new FirebaseNotifier();
        return FirebaseNotifier.instance;
    }

    async sendNotification(message: PushNotificationDto): Promise<Result<string>> {
        let err = false
        try { const res = await admin.messaging().send(message)
        } catch(e) { err = true } 
        if ( !err ) return Result.success<string>('mensaje enviado', 200)
        return Result.fail<string>(new Error('error enviando token'), 500, 'error enviando push')
        
    }

}