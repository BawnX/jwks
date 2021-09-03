import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import MainService from '@main/main.service';
import { validate } from '@main/config/environment.config';
import KeyVault from '@main/config/keyvault.config';
import { DayJsConfig } from '@main/config/dayjs.config';
import CertificateModule from '@certificates/modules/certificate.module';
import CertificateAction from '@certificates/services/actions/certificate.action';
import AuthorizationModule from '@authorization/modules/authorization.module';
import { TasksCertificates } from '@certificates/services/crons/certificates.cron';

const crons = [ TasksCertificates ];

const ENV = process.env.NODE_ENV;

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
            isGlobal: true
        }),
        CertificateModule,
        AuthorizationModule
    ],
    providers: [
        MainService,
        {
            provide: 'KEYVAULT',
            useClass: KeyVault
        },
        {
            provide: 'DAYJS',
            useClass: DayJsConfig
        },
        {
            provide: 'CERTIFICATE_ACTION',
            useClass: CertificateAction
        },
        ...crons
    ]
})
export class MainModule
{
}
