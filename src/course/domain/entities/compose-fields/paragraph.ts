


export class Paragraph
{

    private text: string

    protected constructor ( text: string )
    {
        this.text = text
    }

    get Text (): string
    {
        return this.text
    }

    static create ( text: string ): Paragraph
    {
        return new Paragraph( text )
    }


}