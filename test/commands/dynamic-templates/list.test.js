const { expect, test } = require('@twilio/cli-test');
const { Config, ConfigData } = require('@twilio/cli-core').services.config;
const DynamicTemplatesList = require('../../../src/entities/remote/template');

/* eslint-disable camelcase */
// const INFO_LOG = {
//   sid: 'NO11111111111111111111111111111111',
//   log_level: 'info',
//   error_code: '11111',
//   alert_text: 'My name is "Sue"!',
//   date_created: '1969-02-24T19:39:29Z'
// };

// const WARN_LOG = {
//   sid: 'NO22222222222222222222222222222222',
//   log_level: 'warning',
//   error_code: '22222',
//   alert_text: 'How do you do!?',
//   date_created: '1969-02-24T20:40:30Z'
// };

// const ERROR_LOG = {
//   sid: 'NO22222222222222222222222222222222',
//   log_level: 'error',
//   error_code: '22222',
//   alert_text: 'sourceComponent=14100&httpResponse=502&url=https%3A%2F%2Fdemo.stwilio.com%2Fwelcome%2Fsms%2Freply%2F&ErrorCode=11210&LogLevel=ERROR&Msg=HTTP+bad+host+name&EmailNotification=false',
//   date_created: '1969-02-24T20:40:30Z'
// };
/* eslint-enable camelcase */

const testConfig = test
  .stdout()
  .twilioFakeProfile(ConfigData)
  .twilioCliEnv(Config);

describe('dynamic-templates:list', () => {
  describe('list', () => {
    // const testHelper = (args, responseCode, responseBody) => testConfig
    //   .nock('https://api.sendgrid.com', api => {
    //     api.get('/v3/templates')
    //       .query(true)
    //       .reply(responseCode, responseBody);
    //   })
    //   .twilioCommand(DynamicTemplatesList, args);

    // testHelper([], 200, { alerts: [INFO_LOG] })
    //   .it('prints alert/log events', ctx => {
    //     expect(ctx.stdout).to.contain(INFO_LOG.alert_text);
    //   });

    // testHelper([], 200, { alerts: [ERROR_LOG] })
    //   .it('prints errors', ctx => {
    //     expect(ctx.stdout).to.contain('HTTP bad host name');
    //   });

    // testHelper([
    //   '--start-date',
    //   '2000-01-01',
    //   '--end-date',
    //   '2001-01-01'
    // ], 200, { alerts: [WARN_LOG] })
    //   .it('accepts date args', ctx => {
    //     expect(ctx.stdout).to.contain(WARN_LOG.alert_text);
    //   });

    // testHelper([], 404, { code: 12345, message: 'Some random error' })
    //   .catch(/12345.*Some random error/)
    //   .it('prints errors');
  });

});
