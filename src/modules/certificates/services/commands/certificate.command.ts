import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JWK } from 'node-jose';
import { CertificatesActionsInterface } from '@main/interfaces/certificate.interface';
import { GetJWKS } from '@certificates/services/commands/certificate.implement';
import KeyStore = JWK.KeyStore;

@CommandHandler(GetJWKS)
export class GetJWKSHandler implements ICommandHandler<GetJWKS>
{
    constructor(
    @Inject('CERTIFICATE_ACTION') private readonly certificateAct: CertificatesActionsInterface
    ) {}

    public async execute(): Promise<KeyStore>
    {
        return this.certificateAct.ConvertKeysToKeysStore();
    }
}

// @CommandHandler(AddKeysGenerate)
// export class AddKeysGenerateHandler implements ICommandHandler<AddKeysGenerate>
// {
//     public async execute(): Promise<{ keys?: Array<JWK.Key> }>
//     {
//         const ks: { keys?: Array<JWK.Key> } = MainService.certificate;
//         const keyStore = await JWK.asKeyStore(ks);
//         await keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' });
//
//         const json: { keys?: Array<Key> } = keyStore.toJSON(true);
//
//         json.keys = json.keys ? json.keys.reverse() : [];
//         MainService.certificate = json;
//         await updateCertificate();
//
//         return MainService.certificate;
//     }
// }
//
// @CommandHandler(DelKeysGenerate)
// export class DelKeysGenerateHandler implements ICommandHandler<DelKeysGenerate>
// {
//     public async execute(): Promise<{ keys?: Array<JWK.Key> }>
//     {
//         const ks = MainService.certificate;
//         if ((ks.keys ? ks.keys.length : []) > 1 ) (ks.keys ? ks.keys : []).pop();
//
//         MainService.certificate = ks;
//         await updateCertificate();
//
//         return MainService.certificate;
//     }
// }
