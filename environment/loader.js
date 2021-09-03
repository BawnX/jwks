const fs = require('fs');
const app = require('../package.json');
const { downloadEnvFile } = require('./utils/download-env-file');

/**
 * Loads a environment variables
 * from local storage or from
 * azure key vault.
 *
 * @returns {any} environment object
 */
module.exports = new Promise(async (resolve) => {
    // reads environments from command line arguments
    const envs = process.argv[process.argv.indexOf('-e') + 1].split(',');

    const modeName = envs[1];
    const envName = envs[0];

    resolve({
        // environment variables
        [envName]: {
            ...(await loadEnvFile(`environment/base/default.env.json`)),

            ...(await loadEnvFile(
                `environment/env/${envName}.env.json`,
                envName
            )),

            ...(await loadEnvFile(
                `environment/base/${modeName}.env.json`,
                modeName
            )),

            ...(await loadEnvFile(
                `environment/env/${envName}.local.env.json`,
                envName,
                true
            ))
        },
        // default and env mode variables
        [modeName]: {
            PROJECT: app.name,
            VERSION: app.version,
            TITLE: app.title
        }
    });
});

/**
 * Loads a environment file from
 * local storage or azure key vault.
 *
 * @param {string} filePath
 * @param {string} envName environment name (dev|qa|prod)
 * @param {boolean} isLocal if config is a local file
 *
 * @returns {any} secrets object
 */
async function loadEnvFile(filePath, envName, isLocal = false) {
    // local file exists, so loads it
    if (fs.existsSync(filePath))
        return JSON.parse(fs.readFileSync(filePath));

    // if config is local and doesn't exists
    if (isLocal) {
        fs.writeFileSync(filePath, '{}');

        return {};
    }

    return await downloadEnvFile(filePath, envName);
}
