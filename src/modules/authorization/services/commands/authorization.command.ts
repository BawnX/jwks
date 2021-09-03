import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JWK, JWS } from 'node-jose';
import { Inject } from '@nestjs/common';
import jtp, { RSA } from 'jwk-to-pem';
import { JwtService } from '@nestjs/jwt';
import MainService from '@main/main.service';
import CreateSignResult = JWS.CreateSignResult;
import { GetToken, PostVerify } from '@authorization/services/commands/authorization.implement';
import { CertificatesActionsInterface, KeysJWKInterface } from '@main/interfaces/certificate.interface';
import { ConfigService } from '@nestjs/config';

@CommandHandler(GetToken)
export class GetTokenHandler implements ICommandHandler<GetToken>
{
    constructor(private readonly configService: ConfigService)
    {
    }

    public async execute(command: GetToken): Promise<CreateSignResult>
    {
        const { data } = command;
        const ks = MainService.certificate;
        const keyStore = await JWK.asKeyStore(ks);
        const [ key ] = keyStore.all({ use: 'sig' });

        const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } };
        const payload = JSON.stringify({
            exp: Math.floor((Date.now() + 8.64e+7) / 1000),
            iat: Math.floor(Date.now() / 1000),
            iss: this.configService.get('ISS_JWT'),
            jwks_uri: this.configService.get('JWKS_URI'),
            token_endpoint: this.configService.get('TOKEN_ENDPOINT'),
            authorization_endpoint: this.configService.get('AUTHORIZATION_ENDPOINT'),
            ...data
        });

        return JWS.createSign(opt, await JWK.asKey(key))
            .update(payload)
            .final();
    }
}

@CommandHandler(PostVerify)
export class PostVerifyHandler implements ICommandHandler<PostVerify>
{
    constructor(
    @Inject('CERTIFICATE_ACTION') private readonly certificateAct: CertificatesActionsInterface,
    private jwtService: JwtService
    ) {}

    public async execute(command: PostVerify): Promise<any>
    {
        const { token } = command;
        const jwks = await this.certificateAct.ConvertKeysToKeysStore();

        const keysRsa: KeysJWKInterface<RSA> = jwks.toJSON();

        let isInvalid;

        for (const key of (keysRsa.keys ?? []))
        {
            const publicKey = jtp(key);
            try
            {
                return { isValid: true, ...await this.jwtService.verifyAsync(token, { publicKey }) };
            }
            catch (e)
            {
                isInvalid = { isInvalid: false };
            }
        }

        return isInvalid;
    }
}
