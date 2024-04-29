import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"



export class TestService implements IApplicationService<{ name: string, price: number, userId: string }, string>
{
    async execute ( data: { name: string; price: number, userId: string } ): Promise<Result<string>>
    {
        if ( data.price < 0 )
            return Result.fail<string>( new Error( "el precio no puede ser negativo" ), 400, "el precio no puede ser negativo" )
        return Result.success<string>( "guardado", 200 )
    }
    get name (): string
    {
        return "TestService"
    }

}