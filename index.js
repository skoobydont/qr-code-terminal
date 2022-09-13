const prompt = require('prompt');
const qrcode = require('wifi-qr-code-generator');
const process = require('process');
const colors = require('@colors/colors/safe');
const NAME_INPUT_ERROR_MESSAGE = 'Name must be only letters, spaces, dashes, or single quotes';
// Skip first 2 elements in process.argv array to grab any - or -- options passed
const argv = require('minimist')(process.argv.slice(2));
/**
 * Define Input Schema
 */
const schema = {
  properties: {
    name: {
      description: colors.brightGreen.bgBlack('Enter network name'),
      pattern: /^[a-zA-Z0-9\s\-\']+$/,
      message: colors.zalgo(NAME_INPUT_ERROR_MESSAGE),
      required: true,
    },
    password: {
      description: colors.brightGreen.bgBlack('Enter network password'),
      hidden: true,
    },
  },
};
/**
 * Handle Prompt Input
 * @async
 * @param {any} error any prompt errors
 * @param {{ name, password }} result the user input for wifi name & pwd
 * @returns {any} exit code based on result & any errors
 */
async function handlePromptInput(error, result = argv) {
  if (error) {
    console.warn('error: ', colors.zalgo(error));
    return process.exit(1);
  }
  try {
    console.clear();
    console.log(colors.rainbow(`\n\n\n${result.name} Login:\n`));
    console.log(await qrcode.generateWifiQRCode({
      ssid: result.name,
      password: result.password,
      encryption: 'WPA',
      hiddenSSID: false,
      outputFormat: { type: 'terminal' },
    }));
    return process.exit(0);
  } catch (er) {
    console.error(colors.zalgo('qr code error: '), er);
    return process.exit(1);
  }
};
/**
 * Prompt Options
 */
prompt.message = '';
prompt.delimiter = colors.brightGreen.bgBlack(':');
prompt.override = argv;
/**
 * Start prompt
 */
prompt.start();
/**
 * Handle Input
 */
prompt.get(schema, handlePromptInput);
