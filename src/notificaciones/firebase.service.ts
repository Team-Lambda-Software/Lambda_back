import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import {OrmUserRepository} from '../user/infraestructure/repositories/orm-repositories/orm-user-repository'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRZxF5TeR6gzZI8mzBnFhpazi4i-oDuvk",
  authDomain: "lambda-af8b3.firebaseapp.com",
  projectId: "lambda-af8b3",
  storageBucket: "lambda-af8b3.appspot.com",
  messagingSenderId: "250994920184",
  appId: "1:250994920184:web:dd594ab580b7f986ebc90d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
@Injectable()
export class FirebaseService {
  constructor(private userRepository: OrmUserRepository) {
    const serviceAccount = require("B:/UCAB/Desarrollo/lambda-af8b3-firebase-adminsdk-82la1-8523f1e9c8.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  async sendPushNotificationToAllUsers(message: string) {
    const result = await this.userRepository.findAllUser(); // Usar el método a través del repositorio inyectado
    if (result.isSuccess()) {
      const users = result.Value;
      users.forEach(user => {
        this.sendPushNotification(user.Id, 'Buenos días', message);
      });
    } else {
      console.error('Failed to retrieve users:', result.Error);
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
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
