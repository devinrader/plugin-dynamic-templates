const handler = require('./list');

const command = '$0 <name>';
const describe = 'Lists local and remote SendGrid Dynamic Templates';

module.exports = {
  command,
  describe,
  handler
};
