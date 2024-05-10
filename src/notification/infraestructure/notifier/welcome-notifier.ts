import * as admin from 'firebase-admin';
import { TokenNotification } from 'src/common/Application/notifier/dto/token-notification.dto';
import { INotifier } from 'src/common/Application/notifier/notifier.application';
import { Result } from 'src/common/Application/result-handler/Result';

/*const message = { 
    notification: { title: "Notif", body: 'This is a Test Notification' }, 
    token: 'cj95PAeY2ybZNh08vbyOAi:APA91bGD1PiE9rgiB7JDTwrcacSx5wcCrDy8Q93wx75tHj7g8H7W-RzkW2G8AjQedcmGpsrsjJRDOX3Ac5hMqdw8QXY-K6LJ0LS-X0qYzMKlqAgOhB6ZiHmfkXHLfuAHfGpCBwanH55A' 
}*/

/*const credentials:object = {
    type: "service_account",
    project_id: "myawe-91958",
    private_key_id: "cdd2a0da10bd579f3b4052cbad71ca0140d91d7d",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCSs35f3hHNKTb4\nNZO6lOfMrH864dAgRF54TD/QkxnUMde+u2sJbhypD29oa3nUngeMF5zsnkHFNrBs\n/DSLsAlHl1C4gJArbvvADeopWSBylhhZHsot995V0UyFgpDfjL8fSt08So0aGPD2\nOtGZKZlEDBby4TCTWMPgsI78NaQUP2YY2dbmIkQRlfXKfMoEVJX+Pj6OysGDL1TY\nnwItMX9cDDCAU2acNlabOKNtrSvssISr4FF+qxec7WX/I/1PcNrHsWbrUzDfZUqo\n5Ndmr97EY8QF4OoREa87HcLd23hZ33Y56tsoqZgMBxI+pXQzgcAh25PZxRj/gMcn\ndrkYhS3BAgMBAAECggEABGdWAygjGRlIR6xRzNZdxJEOZQrQktnjizVYfm0Of8Yu\n4IhPJ9Rn4McsXi5I/Qnw/n6KVtffr/0er9hUplduiWEmZqHxFfUwAl92jqcAymDF\nHoZ+HaHy0RkaNLknCrdemLiYTlgrbvfGArGwf1JKYgqR/Sinauplj5z0L1fnvuXu\nSLvgSfTeEzOP9seYtYFbE0ERyB/2uAyQw4eYKAvgkeuyNkeh0nxV76tpReHfB55L\nlMn9BFY0/RCpjzrkzPsR9VeggBJngqQsiZ4IGC3+n2DaK5pG48VqwA93awaO/KM7\nwDe7skpOqAnbmFVtKq8aGxJ0+R65NnnfxGaNAmAKoQKBgQDJVIeKNNPXeiYzOwNt\nwG+kEDJiUDPG0fEZAltF/xANNsuwHmHSYgV5WeELrBGlCGGHFXt34hmT28/+XXoW\nYlOJtOvo2ON9zKe+/YMgGh+anJrUJtYNp5jEiPpTihD/Tkwj8Q3Dlk6+oyDePW4S\nVmvXnAeIeZ8b3oclSH5uMePXoQKBgQC6iWzrj56FwzP15oru74SGfoTwxoazcfWc\nDxWTfQ2wEHhMG0FUpOA/V929GxCFJg31Bky8hJ2sApUitbKJDPCPb8+DNevJdzdv\nzvJY05bNbvbvbghLxpOBSEEl0E2G9rv9LsM/jxGSxiFwaZfXGGbMa7aKO6iEfmZ/\nhqTsnKMiIQKBgQDC+i8NpN2oJ67JHJTUfHJiNCFnXv7VxMo2izaz0jHMak3XMYVR\nBwcAIBA3ipvH9RbmiOJ7Fqforw9+6y5qcS0wBtwVM78VPNcTu1Z7B3Gl/ZZgcYAJ\n1062v2WW8/ZEGqLYiAHpci6upzMUp+9qqPFl7MDK5eY2Sksdy1hOBdj/IQKBgQCn\n16nK1yKDJ15knzlZvuiW/9Zss6VWZ27hKe13FSmwx1EG4etJ10TzmgMp+eVGeTRL\nyYxYgFdDA9vfLHBlwt/doHSukmEDmSKnlyUW6eQiGvtT+sS6MgZdaH8+IAzyKKaE\nLISAdyIP1/kUpd57KzisLStFfGKoPPfLPYK+aD6dIQKBgQC5ZLAitAMsUhgiWqZQ\nJDsAcwlM8zZ5JbQluC8yNo6PEu6o1JKlu47nrNMNUNFE9vER6vVIcW87rHc6KQZ9\n9wSqak8Qwnl22H1yXMUMIa/iJoVkxIsjpqqnHRabzB6uN5Vy6VinY/Wukdpp2dJW\neAVjCy4AWeIe6D+8hoBL3nhIaA==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-6p01o@myawe-91958.iam.gserviceaccount.com",
    client_id: "106988493002814302645",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6p01o%40myawe-91958.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
}

admin.initializeApp({ credential: admin.credential.cert(credentials) })*/

export class WelcomeNotifier extends INotifier<string> {
    
    setVariable(variable: string): void {
        throw new Error('Method not implemented.');
    }
    
    async sendNotification(data: TokenNotification): Promise<Result<string>> {
        let err = false

        const message = { 
            notification: { title: "Welcome", body: 'Welcome my budy!' }, 
            token: data.token
        }
        
        try {
            const res = await admin.messaging().send(message)
        } catch(e) {  /// e.errorInfo
            err = true        
        } 

        if ( err == false ) return Result.success<string>('mensaje enviado', 200)
        return Result.fail<string>(new Error('error enviando token'), 500, 'error enviando push')
        
    }
} 