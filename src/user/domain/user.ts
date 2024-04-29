import { Entity } from "src/common/Domain/domain-object/entity.interface"



export class User extends Entity<string>
{

    private firstName: string
    private firstLastName: string
    private secondLastName: string
    private email: string
    private password: string
    //TODO: Add fields for the stadistics, courses made, etc.

    private constructor ( id: string, firstName: string, firstLastname: string, secondLastName: string, email: string, password: string )
    {
        super( id )
        this.firstName = firstName
        this.firstLastName = firstLastname
        this.secondLastName = secondLastName
        this.email = email
        this.password = password
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

    static create ( id: string, firstName: string, firstLastname: string, secondLastName: string, email: string, password: string ): User
    {
        return new User( id, firstName, firstLastname, secondLastName, email, password )
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




}