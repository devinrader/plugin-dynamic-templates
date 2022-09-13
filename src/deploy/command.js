const handler = require('./deploy');

const command = '$0 <name>';
const describe = 'Deploys a SendGrid Dynamic Template';

module.exports = {
  command,
  describe,
  handler
};
