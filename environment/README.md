#### This folder should contains environment variables loader, publisher and keys.

## 1. Requirements

#### 1.1. Dependencies

-   Install **env-cmd** library with `npm i -D env-cmd`.
-   Install **azure-key-vault** library with `npm i -D @achs/azure-key-vault`.

#### 1.2. NPM Scripts

For load desired environment, add you npm script like **`env-cmd -e <env>,<mode> -r environment/loader.js <your-command>`**.

-   **mode**: (build|debug|test) execution mode base variables.
-   **env**: (dev|qa|prod) environment variables.

_For example: `env-cmd -e dev,debug -r environment/loader.js npm run start`_

## 2. Structure

#### 2.1. Modes (environment/base)

Your `environment/base` folder should contains files below:

-   **default.env.json**: default variables for the rest of environments.
-   **build.env.json**: loaded on build execution.
-   **test.env.json**: loaded on test execution.
-   **debug.env.json**: loaded on local debugging execution.

_This folder contains every base environment variables files a.k.a. environment execution modes._

#### 2.2. Environments (environment/env)

Your `environment/env` folder should contains files below:

-   **dev.env.json**: development environment.
-   **dev.local.env.json**: local development environment. Replaces non local.
-   **qa.env.json**: quality assurance environment.
-   **qa.local.env.json**: local qa environment. Replaces non local.
-   **prod.env.json**: production environment.
-   **prod.local.env.json**: local production environment. Replaces non local.

_This folder should contains environment variables files for system environments._

#### 2.3. Keys (environment/keys.json)

Your `keys.json` file should contains:

```json
{
    "config": {
        "project": "<project-name>",
        "group": "<app-name>"
    },
    "<env-name>": {
        "keyVaultUri": "<azure-key-vault-uri>",
        "clientId": "<spn-client-id>",
        "clientSecret": "<spn-secret-password>",
        "tenantId": "<tenant-id>"
    },
    ...
}
```

For example:

```json
{
    "config": {
        "project": "achs-virtual",
        "group": "web-app-launcher"
    },
    "dev": {
        "keyVaultUri": "https://my-key-vault.dev.vault.azure.net",
        "clientId": "f176a774-239e-4cd3-8551-88fd9fb9b441",
        "clientSecret": "WyBwkmcL8rGQe9B2fvRLDrqDuannE4Ku",
        "tenantId": "9dba8525-be64-4d10-b124-e6f1644ae513"
    },
    "qa": {
        "keyVaultUri": "https://my-key-vault.qa.vault.azure.net",
        "clientId": "5dcd9f45-7067-4387-94d8-e5e7066ba630",
        "clientSecret": "60ec5e16430a46eba70dfea80d721b66",
        "tenantId": "9dba8525-be64-4d10-b124-e6f1644ae513"
    }
}
```

_This file allows to load environment files locally first run time._

## 3. Commands

You can use two command scripts for refresh your local env files
or publish/updates env files in the azure key vault from your local files.

-   **Refresh Environment File**: `node environment/cmd sync -e <env> [-f]`. (-f forces to replace your local file).
-   **Publish Environment File**: `node environment/cmd publish -e <env>`.

#### 3.1. Environment Variables for Credentials

You can set your credentials variables from node environment variables.

For example:

```bash
user@machine:/mnt/c/Users/user$ AKV_PROJECT=av2 \
                                AKV_GROUP=ac \
                                AKV_URI=https://my-key-vault.dev.vault.azure.net \
                                AKV_CLIENT_ID=f176a774-239e-4cd3-8551-88fd9fb9b441 \
                                AKV_CLIENT_SECRET=WyBwkmcL8rGQe9B2fvRLDrqDuannE4Ku \
                                AKV_TENANT_ID=9dba8525-be64-4d10-b124-e6f1644ae513 \
                                node environment/cmd sync -e dev -f
```

## 4. Priority

### From lowest to highest.

-   `default.env.json` (default values)
-   `(dev|qa|prod).env.json`
-   `(debug|build|test).env.json`
-   `(dev|qa|prod).local.env.json` (replaces all previous vars)
