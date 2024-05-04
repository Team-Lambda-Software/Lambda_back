/* eslint-disable prettier/prettier */
import { Entity } from "src/common/Domain/domain-object/entity.interface"



export class User extends Entity<string>
{

    private firstName: string
    private firstLastName: string
    private secondLastName: string
    private email: string
    private password: string
    private phone: string
    //TODO: Add fields for the stadistics, courses made, etc.

    private constructor ( id: string, firstName: string, firstLastname: string, secondLastName: string, email: string, password: string, phone: string )
    {
        super( id )
        this.firstName = firstName
        this.firstLastName = firstLastname
        this.secondLastName = secondLastName
        this.email = email
        this.password = password
        this.phone = phone
    }

    get FirstName (): string
    {
        return this.firstName
    }

    get FirstLastName (): string
    {
        return this.firstLastName
    }

    get SecondLastName (): string
    {
        return this.secondLastName
    }

    get Email (): string
    {
        return this.email
    }

    get Password (): string
    {
        return this.password
    }

    get Phone (): string
    {
        return this.phone
    }

    static create ( id: string, firstName: string, firstLastname: string, secondLastName: string, email: string, password: string, phone: string ): User
    {
        return new User( id, firstName, firstLastname, secondLastName, email, password, phone )
    }

    public updateFirstName ( firstName: string ): void
    {
        this.firstName = firstName
    }

    public updateFirstLastName ( firstLastName: string ): void
    {
        this.firstLastName = firstLastName
    }

    public updateSecondLastName ( secondLastName: string ): void
    {
        this.secondLastName = secondLastName
    }

    public updateEmail ( email: string ): void
    {
        this.email = email
    }

    public updatePassword ( password: string ): void
    {
        this.password = password
    }

    public updatePhone (phone: string): void
    {
        this.phone = phone
    }


}