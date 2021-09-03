import { INestApplication, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { swaggerInit } from './config';
import { ConfigService } from '@nestjs/config';
import { KeyvaultInterface } from '@main/interfaces/keyvault.interface';
import {
    CertificatesActionsInterface,
    KeysJWKInterface,
    TimeCertificatesInterface
} from '@main/interfaces/certificate.interface';
import { DayjsInterface } from '@main/interfaces/dayjs.interface';
import { JWK } from 'node-jose';

export const setUp = async (app: INestApplication): Promise<void> =>
{
    const configService = app.get(ConfigService);
    const logger = new Logger(MainService.name);
    const PORT = configService.get('PORT');

    swaggerInit(app);

    app.enableCors();
    app.enableVersioning();
    app.setGlobalPrefix(<string>configService.get('GLOBAL_API_PREFIX'));

    logger.log(`Servidor iniciado en el puerto: ${PORT}`);

    await app.listen(PORT || 5000);
};

export default class MainService implements OnModuleInit
{
    static certificate: KeysJWKInterface<JWK.Key>;

    static time: TimeCertificatesInterface

    constructor(
    @Inject('KEYVAULT') private readonly keyvault: KeyvaultInterface,
    @Inject('DAYJS') private readonly dayJs: DayjsInterface,
    @Inject('CERTIFICATE_ACTION') private readonly certificateAct: CertificatesActionsInterface,
    private readonly configService: ConfigService
    )
    {}

    public async onModuleInit(): Promise<void>
    {
        MainService.certificate = <KeysJWKInterface<JWK.Key>> await this.keyvault.get('certificateKeys');
        MainService.time = <TimeCertificatesInterface> await this.keyvault.get('timeCertificates');

        if (MainService.time === null)
        {
            MainService.time = {
                timeRenovate: this.dayJs.addTime(new Date, <number> this.configService.get('TIME_ROTATION') ?? 1, 'seconds'),
                timeDelete: this.dayJs.addTime(new Date, <number> this.configService.get('TIME_RENOVATE') ?? 1, 'seconds')
            };
        }

        if (MainService.certificate === null)
        {
            MainService.certificate = await this.certificateAct.GenerateKeys(3);
            await this.certificateAct.UpdateCertificate();
        }
    }
}
