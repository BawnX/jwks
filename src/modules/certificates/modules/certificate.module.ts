import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import CertificateController from '@certificates/controllers/certificate.controller';
import { GetJWKSHandler } from '@certificates/services/commands/certificate.command';
import CertificateAction from '@certificates/services/actions/certificate.action';
import KeyVault from '@main/config/keyvault.config';

const controllers = [ CertificateController ];
const commandHandler = [ GetJWKSHandler ];

@Module({
    imports: [
        CqrsModule,
        ScheduleModule.forRoot()
    ],
    controllers,
    providers: [
        {
            provide: 'CERTIFICATE_ACTION',
            useClass: CertificateAction
        },
        {
            provide: 'KEYVAULT',
            useClass: KeyVault
        },
        ...commandHandler
    ],
    exports: [ CertificateModule ]
})
export default class CertificateModule
{
}
