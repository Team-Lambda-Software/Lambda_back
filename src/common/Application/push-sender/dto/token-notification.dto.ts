
export interface PushNotificationDto {
    token: string
    notification: { 
        title: string 
        body: string
        icon?: string
    } 
}

export interface PushMulticastDto {
    token: string[]
    notification: { 
        title: string 
        body: string
        icon?: string
    } 
}
