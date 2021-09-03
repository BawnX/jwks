const fs = require('fs');

/**
 * Loads azure key vault config
 * and SPN credentials from
 * process.env or 'keys.json' file.
 *
 * @param {string} envName environment name (dev|qa|prod)
 *
 * @returns {any} akv config and credentials
 */
exports.loadCredentials = function loadCredentials(envName) {
    if (process.env.AKV_URI)
        return {
            config: {
                project: process.env.AKV_PROJECT,
                group: process.env.AKV_GROUP,
            },
            [envName]: {
                keyVaultUri: process.env.AKV_URI,
                clientId: process.env.AKV_CLIENT_ID,
                clientSecret: process.env.AKV_CLIENT_SECRET,
                tenantId: process.env.AKV_TENANT_ID,
            },
        };

    return JSON.parse(fs.readFileSync('environment/keys.json'));
};
