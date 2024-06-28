
export interface PushNotificationDto {
    token: string
    notification: { 
        title: string 
        body: string
    } 
}

export interface PushMulticastDto {
    token: string[]
    notification: { 
        title: string 
        body: string
    } 
}
