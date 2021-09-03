import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { GetToken, PostVerify } from '@authorization/services/commands/authorization.implement';

@ApiTags('Authorization')
@Controller({
    path: 'authorization',
    version: '1'
})
export default class AuthorizationController
{
    constructor(private readonly commandBus: CommandBus) {}

    @Post('token')
    public getToken(@Body() body: { user: any }): Promise<{ success: boolean }>
    {
        return this.commandBus.execute(new GetToken(body.user));
    }

    @Post('verify')
    public postVerify(@Body() body: { token: string }): Promise<any>
    {
        return this.commandBus.execute(new PostVerify(body.token));
    }
}
