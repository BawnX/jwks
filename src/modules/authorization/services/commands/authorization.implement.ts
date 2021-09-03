import { ICommand } from '@nestjs/cqrs';

export class GetToken implements ICommand
{
    constructor(public readonly data: any) {}
}

export class PostVerify implements ICommand
{
    constructor(public readonly token: string) {}
}
