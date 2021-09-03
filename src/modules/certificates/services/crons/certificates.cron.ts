import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import MainService from '@main/main.service';
import dayjs from 'dayjs';
import { rotate } from '@main/common/utils/array.lib';
import { JWK } from 'node-jose';
import { CertificatesActionsInterface, KeysJWKInterface } from '@main/interfaces/certificate.interface';
import { DayjsInterface } from '@main/interfaces/dayjs.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksCertificates
{
    constructor(
    @Inject('CERTIFICATE_ACTION') private readonly certificateAct: CertificatesActionsInterface,
    @Inject('DAYJS') private readonly dayJs: DayjsInterface,
    private readonly configService: ConfigService
    )
    {}

    @Cron('1 * * * * *')
    public async rotate()
    {
        if (MainService.time.timeRenovate.isBefore(dayjs(new Date)) && !MainService.time.timeDelete.isBefore(dayjs(new Date)))
        {
            const ks: KeysJWKInterface<JWK.Key> = MainService.certificate;
            MainService.certificate = { keys: rotate<JWK.Key>(ks.keys ?? [], 1) };
            await this.certificateAct.UpdateCertificate();

            return MainService.time.timeRenovate= this.dayJs.addTime(new Date, <number> this.configService.get('TIME_ROTATION'), 'seconds');
        }

        if (MainService.time.timeDelete.isBefore(dayjs(new Date)))
        {
            MainService.certificate = await this.certificateAct.GenerateKeys(3);
            await this.certificateAct.UpdateCertificate();

            return MainService.time.timeDelete= this.dayJs.addTime(new Date, <number> this.configService.get('TIME_RENOVATE'), 'minutes');
        }

        return false;
    }
}
