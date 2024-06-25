/* eslint-disable prettier/prettier */

export interface FindUserResponseDTO
{
    id: string
    name: string
    email: string
    password: string
    type: string
    image?: string
    phone?: string
}