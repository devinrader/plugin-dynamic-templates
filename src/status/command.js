const handler = require('./status');

const command = '$0 <name>';
const describe = 'Displays the Remote and Local status of a Dynamic Template';

module.exports = {
  command,
  describe,
  handler
};
