


export class CategoryIcon {
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

    static create ( url: string, id: string ): CategoryIcon
    {
        return new CategoryIcon( url, id )
    }

}