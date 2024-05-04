



export class Image
{

    private id: string
    private url: string

    protected constructor ( url: string, id: string )
    {
        this.url = url
        this.id = id
    }

    get Url (): string
    {
        return this.url
    }

    get Id (): string
    {
        return this.id
    }

    //TODO: para DDD vamos a tener que validar la creacion de estos objetos y crear un metodo equal

    static create ( url: string, id: string ): Image
    {
        return new Image( url, id )
    }

}