const fs = require('fs');
const { AzureKeyVault } = require('@achs/azure-key-vault');
const { loadCredentials } = require('./load-credentials');

/**
 * Uploads/updates a environment
 * file to azure key vault.
 *
 * @param {string} filePath
 * @param {string} envName environment name (dev|qa|prod)
 *
 * @returns {any} secrets
 */
exports.uploadEnvFile = async function uploadEnvFile(filePath, envName) {
    // loads akv config and credentials
    const { config, [envName]: credentials } = loadCredentials(envName);

    const keyVault = new AzureKeyVault(
        {
            ...config,
            env: envName,
        },
        credentials
    );

    // loads local env file
    const secrets = JSON.parse(fs.readFileSync(filePath));

    await keyVault.setAll(secrets);

    return secrets;
};
