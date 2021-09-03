module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testEnvironment: 'node',
    collectCoverageFrom: ['**/modules/**/*.ts'],
    moduleNameMapper: {
        "^@main/(.*)$": "<rootDir>/src/$1",
        "^@certificates/(.*)$": "<rootDir>/src/modules/certificates/$1",
        "^@authorization/(.*)$": "<rootDir>/src/modules/authorization/$1"
    }
}