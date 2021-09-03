import { ICommand } from '@nestjs/cqrs';

export class GetJWKS implements ICommand
{
    constructor() {}
}

// export class AddKeysGenerate implements ICommand
// {
//     constructor() {}
// }
//
// export class DelKeysGenerate implements ICommand
// {
//     constructor() {}
// }
