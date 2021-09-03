import { Inject, Injectable } from '@nestjs/common';
import { JWK } from 'node-jose';
import MainService from '@main/main.service';
import { CertificatesActionsInterface, KeysJWKInterface } from '@main/interfaces/certificate.interface';
import { KeyvaultInterface } from '@main/interfaces/keyvault.interface';

@Injectable()
export default class CertificateAction implements CertificatesActionsInterface
{
    constructor(
    @Inject('KEYVAULT') private readonly keyvault: KeyvaultInterface
    )
    {}

    public ConvertKeysToKeysStore(): Promise<JWK.KeyStore>
    {
        const ks: { keys?: Array<JWK.Key> } = MainService.certificate;

        return JWK.asKeyStore(ks);
    }

    public async GenerateKeys(count: number): Promise<KeysJWKInterface<JWK.Key>>
    {
        const keyStore = JWK.createKeyStore();
        const keysJson: KeysJWKInterface<any> = { keys: [] };
        for (let i = 0; i < count; i++)
        {
            const key = await this.AddCertificate(keyStore);
            const json = key.toJSON(true);

            (keysJson.keys ?? []).push(json);
        }

        return keysJson;
    }

    public AddCertificate(keystore: JWK.KeyStore): Promise<JWK.Key>
    {
        return keystore.generate('RSA', 2048, {
            alg: 'RS256',
            use: 'sig'
        });
    }

    public async UpdateCertificate(): Promise<void>
    {
        return Promise.resolve(await this.keyvault.set('certificateKeys', MainService.certificate));
    }
}
