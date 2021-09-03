const config = require('./jest.config')
config.testRegex = '(/__tests__/.*|(\\.|/)(test))\\.ts?$'
module.exports = config