
export interface PushNotificationDto {
    token: string
    notification: { 
        title: string 
        body: string
    } 
}