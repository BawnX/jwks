const fs = require('fs');
const { downloadEnvFile } = require('./utils/download-env-file');
const { uploadEnvFile } = require('./utils/upload-env-file');
const { refreshModel } = require('./utils/refresh-model');

(async () => {
    const envName = process.argv[process.argv.indexOf('-e') + 1];
    const filePath = `environment/env/${envName}.env.json`;

    // update local env file from azure key vault
    if (process.argv.indexOf('sync') > 0) {
        if (process.argv.indexOf('-f') > 0 || !fs.existsSync(filePath))
            await downloadEnvFile(filePath, envName);

        return;
    }

    // publishes/updates a local env file to azure key vault
    if (process.argv.indexOf('publish') > 0) {
        const secrets = await uploadEnvFile(filePath, envName);

        // updates environment.schema.json
        refreshModel(secrets);

        return;
    }

    throw new Error(`Command does not exits`);
})();
