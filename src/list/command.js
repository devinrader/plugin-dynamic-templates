const handler = require('./list');

const command = '$0 <name>';
const describe = 'Lists local and remote SendGrid Dynamic Templates';

const cliInfo = {
  options: {
  }
};

function builder(cmd) {
}

module.exports = {
    command,
    describe,
    handler,
    cliInfo,
    builder
  };