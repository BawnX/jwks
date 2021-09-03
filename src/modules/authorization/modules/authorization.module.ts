import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import CertificateAction from '@certificates/services/actions/certificate.action';
import AuthorizationController from '@authorization/controllers/authorization.controller';
import { GetTokenHandler, PostVerifyHandler } from '@authorization/services/commands/authorization.command';
import KeyVault from '@main/config/keyvault.config';

const controllers = [ AuthorizationController ];
const commandHandler = [ GetTokenHandler, PostVerifyHandler ];

@Module({
    imports: [ CqrsModule, JwtModule.register({}) ],
    controllers,
    providers: [
        ...commandHandler,
        {
            provide: 'CERTIFICATE_ACTION',
            useClass: CertificateAction
        },
        {
            provide: 'KEYVAULT',
            useClass: KeyVault
        }
    ]
})
export default class AuthorizationModule
{}
