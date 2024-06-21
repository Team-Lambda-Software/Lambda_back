import * as admin from 'firebase-admin';
import { title } from 'node:process';
import { PushNotificationDto } from 'src/common/Application/notifier/dto/token-notification.dto';
import { INotifier } from 'src/common/Application/notifier/notifier.application';
import { Result } from 'src/common/Domain/result-handler/Result';

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
        try { 
            const icon = 'https://firebasestorage.googleapis.com/v0/b/chat-realtime-5e9cc.appspot.com/o/icon-128x128.png?alt=media&token=073a48a1-3adf-4bd8-a259-2ee99daf55c7'
            const msg = {
                // notification : {  }
                token: message.token,
                android: { 
                    notification: {
                        title: message.notification.title,
                        body: message.notification.body,
                        icon: icon, //color: '' icon color in `#rrggbb` format
                    },
                },
                webpush: {
                    notification: {
                        title: message.notification.title,
                        body: message.notification.body,
                        icon: icon, //priority: 'high', sound: 'ringtone', sticky: true
                    } 
                },
            }
            const res = await admin.messaging().send(msg).then( e => { console.log(' sended ') })
            return Result.success<string>('push_sended', 200)
        } catch(e) { 
            return Result.fail<string>(new Error('error_sending_push'), 500, 'error_sending_push')
        } 
    }

}