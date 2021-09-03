import { AzureKeyVault } from '@achs/azure-key-vault';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyvaultInterface } from '../interfaces/keyvault.interface';

@Injectable()
export default class KeyVault implements KeyvaultInterface
{
    constructor(private configService: ConfigService) {}

    public get(key: string): Promise<unknown>
    {
        return new Promise(async (resolve, reject) =>
        {
            const azureKeyVault = this.config();

            resolve(azureKeyVault.get(key, true));
        });
    }

    public set(key: string, object: unknown): Promise<void>
    {
        const azureKeyVault = this.config();

        return azureKeyVault.set(key, object);
    }

    private config(): AzureKeyVault
    {
        return new AzureKeyVault(
            {
                project: <string> this.configService.get('KEYVAULT_PROJECT'),
                group: <string> this.configService.get('KEYVAULT_GROUP'),
                env: <string> this.configService.get('KEYVAULT_ENV')
            },
            {
                keyVaultUri: <string> this.configService.get('KEYVAULT_KEY_URI'),
                clientId: <string> this.configService.get('KEYVAULT_CLIENT_ID'),
                clientSecret: <string> this.configService.get('KEYVAULT_CLIENT_SECRET'),
                tenantId: <string> this.configService.get('KEYVAULT_TENANT_ID')
            }
        );
    }
}