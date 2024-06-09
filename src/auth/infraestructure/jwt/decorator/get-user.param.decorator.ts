import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export const GetUser = createParamDecorator(
    (_data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        if (!request.user) throw new Error(' 404 user not found')
        return request.user
    }
)