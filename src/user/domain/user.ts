import { Entity } from "src/common/Domain/domain-object/entity.interface"



export class User extends Entity<string>
{

    private name: string
    private email: string
    private password: string
    //TODO: Add fields for the stadistics, courses made, etc.

    private constructor ( id: string, name: string, email: string, password: string )
    {
        super( id )
        this.name = name
        this.email = email
        this.password = password
    }

    get Name (): string
    {
        return this.name
    }

    get Email (): string
    {
        return this.email
    }

    get Password (): string
    {
        return this.password
    }

    static create ( id: string, name: string, email: string, password: string ): User
    {
        return new User( id, name, email, password )
    }

    public updateName ( name: string ): void
    {
        this.name = name
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