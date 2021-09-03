const fs = require('fs');
const { AzureKeyVault } = require('@achs/azure-key-vault');
const { loadCredentials } = require('./load-credentials');

const envSchemaPath = 'environment/environment.schema.json';

/**
 * Downloads a environment
 * file from azure key vault.
 *
 * @param {string} filePath
 * @param {string} envName environment name (dev|qa|prod)
 *
 * @returns {any} secrets object
 */
exports.downloadEnvFile = async function downloadEnvFile(filePath, envName) {
    // loads akv config and credentials
    const { config, [envName]: credentials } = loadCredentials(envName);

    const keyVault = new AzureKeyVault(
        {
            ...config,
            env: envName,
        },
        credentials
    );

    let secrets = {};

    if (fs.existsSync(envSchemaPath)) {
        const schema = JSON.parse(fs.readFileSync(envSchemaPath));
        // gets secrets from key vault using a schema
        secrets = await keyVault.getFor(schema, true);
    } else {
        // gets all secrets from key vault
        secrets = await keyVault.getAll();
    }

    // saves env file
    const data = JSON.stringify(secrets, null, 4);
    fs.writeFileSync(filePath, data);

    return secrets;
};
