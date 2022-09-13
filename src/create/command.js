const handler = require('./create');

const command = '$0 <name>';
const describe = 'Creates a new SendGrid Dynamic Template';

const cliInfo = {
  options: {
  }
};

// function builder(cmd) {
//   cmd.positional('name', {
//     describe: 'Name of your template.',
//     type: 'string'
//   });
//   cmd.options(cliInfo.options);
// }

module.exports = {
  command,
  describe,
  handler,
  cliInfo
  // builder
};
