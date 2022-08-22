const handler = require('./status');

const command = '$0 <name>';
const describe = 'Calculates the Remote v Local status of a Dynamic Template';

module.exports = {
    command,
    describe,
    handler,
  };