import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    QA = 'qa',
}

class EnvironmentVariables
{
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    PORT: number;

    @IsString()
    GLOBAL_API_PREFIX: string;

    @IsString()
    KEYVAULT_PROJECT: string;

    @IsString()
    KEYVAULT_GROUP: string

    @IsString()
    KEYVAULT_ENV: string

    @IsString()
    KEYVAULT_KEY_URI: string

    @IsString()
    KEYVAULT_CLIENT_ID: string

    @IsString()
    KEYVAULT_CLIENT_SECRET: string

    @IsString()
    KEYVAULT_TENANT_ID: string

    @IsNumber()
    TIME_ROTATION: number

    @IsNumber()
    TIME_RENOVATE: number

    @IsString()
    ISS_JWT: string

    @IsString()
    JWKS_URI: string

    @IsString()
    TOKEN_ENDPOINT: string

    @IsString()
    AUTHORIZATION_ENDPOINT: string
}

export function validate(config: Record<string, unknown>)
{
    const validatedConfig = plainToClass(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true }
    );

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0)
        throw new Error(errors.toString());

    return validatedConfig;
}