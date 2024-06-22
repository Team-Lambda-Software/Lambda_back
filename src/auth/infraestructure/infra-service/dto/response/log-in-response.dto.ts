
export interface LogInResponseDto {
    token: string,
    type: string,
    user: {
        id: string,
        email: string,
        name: string,
        phone: string,
    }        
}