import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor() {
    const serviceAccount = require("B:/UCAB/Desarrollo/lambda-af8b3-firebase-adminsdk-82la1-8523f1e9c8.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  // En firebase.service.ts

  async sendPushNotificationToAllUsers(message: string) {
    const users = await this.userRepository.findAllWithNotificationTokens(); // Asegúrate de que este método exista y recupere todos los usuarios con sus tokens de notificación
    users.forEach(user => {
      this.sendPushNotification(user.notificationToken, 'Buenos días', message);
    });
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
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}