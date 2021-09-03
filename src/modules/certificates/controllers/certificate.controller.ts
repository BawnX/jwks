import { Controller, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { JWK } from 'node-jose';
import KeyStore = JWK.KeyStore;
import { GetJWKS } from '@certificates/services/commands/certificate.implement';

@ApiTags('Certificate')
@Controller({
    path: 'certificate',
    version: '1'
})
export default class CertificateController
{
    constructor(private readonly commandBus: CommandBus) {}

    @Get('jwks')
    public getJWKS(): Promise<KeyStore>
    {
        return this.commandBus.execute(new GetJWKS());
    }
    //
    // @Get('add')
    // public addKeys(): Promise<KeyStore>
    // {
    //     return this.commandBus.execute(new AddKeysGenerate());
    // }
    //
    // @Get('del')
    // public delKeys(): Promise<KeyStore>
    // {
    //     return this.commandBus.execute(new DelKeysGenerate());
    // }
}
