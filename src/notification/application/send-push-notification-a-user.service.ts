import { Injectable } from "@nestjs/common";
import { FirebaseService } from './firebase.service';
import { User } from "src/user/domain/user";

@Injectable()
export class SendPushNotificationService {
    constructor(private firebaseService: FirebaseService) {}

    async execute(users: User[], message: string) {
        if (users) {
            users.forEach(user => {
                this.sendPushNotification(user.Id, 'Buenos días', message);
            });
        } else {
            console.error('Failed to retrieve users');
        }
    }

    async sendPushNotification(token: string, title: string, body: string) {
        const message = {
            notification: {
                title,
                body,
            },
            token,
        };

        try {
            const response = await this.firebaseService.getMessaging().send(message);
            console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}