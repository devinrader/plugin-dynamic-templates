const handler = require('./deploy');

const command = '$0 <name>';
const describe = 'Deploys a SendGrid Dynamic Template';

const cliInfo = {
  options: {
  }
};

module.exports = {
    command,
    describe,
    handler,
    cliInfo,
  };