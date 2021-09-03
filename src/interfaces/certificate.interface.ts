import { JWK } from 'node-jose';
import dayjs from 'dayjs';
import KeyStore = JWK.KeyStore;

export interface KeysJWKInterface <Type>{
    keys?: Array<Type>
}

export interface TimeCertificatesInterface {
    timeRenovate: dayjs.Dayjs,
    timeDelete: dayjs.Dayjs
}

export interface CertificatesActionsInterface {
    ConvertKeysToKeysStore(): Promise<KeyStore>,
    GenerateKeys(count: number): Promise<KeysJWKInterface<JWK.Key>>,
    AddCertificate(keystore: KeyStore): Promise<JWK.Key>,
    UpdateCertificate(): Promise<void>
}
