import CertificateAction from '@certificates/services/actions/certificate.action';
import KeyVault from '@main/config/keyvault.config';
import { ConfigService } from '@nestjs/config';

describe('Action certificate testing', () =>
{
    let certificateAction: CertificateAction;
    let keyVault: KeyVault;
    let configService: ConfigService;

    beforeEach(() =>
    {
        configService = new ConfigService();
        keyVault = new KeyVault(configService);
        certificateAction = new CertificateAction(keyVault);
    });

    it('should be generate keys', async () =>
    {
        const certifacate = await certificateAction.GenerateKeys(3);

        expect(certifacate).toBeDefined();
        expect(certifacate.keys?.length).toEqual(3);
    });
});